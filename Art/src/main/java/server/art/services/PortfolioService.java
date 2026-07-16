package server.art.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.dto.portfolio.*;
import server.art.data.dto.common.*;
import server.art.data.ArtPiece;
import server.art.data.ArtPieceAsset;
import server.art.data.User;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.ArtPieceRepository;
import server.art.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import org.springframework.security.access.AccessDeniedException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final ArtPieceRepository artPieceRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${aws.s3.url-base}")
    private String s3UrlBase;

    @Value("${imgproxy.url}")
    private String imgproxyUrl;

    @Transactional(readOnly = true)
    public PaginatedResponse<ArtPieceResponseDTO> getPortfolio(UUID userId, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<ArtPiece> piecesPage = artPieceRepository.findByUserIdAndIsPublishedTrue(userId, pageRequest);

        return mapToPaginatedResponse(piecesPage, page, limit);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<ArtPieceResponseDTO> getAllArtworks(int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<ArtPiece> piecesPage = artPieceRepository.findByIsPublishedTrue(pageRequest);
        return mapToPaginatedResponse(piecesPage, page, limit);
    }

    @Transactional(readOnly = true)
    public ArtPieceResponseDTO getArtwork(UUID pieceId) {
        return getArtwork(pieceId, 400, 300);
    }

    @Transactional(readOnly = true)
    public ArtPieceResponseDTO getArtwork(UUID pieceId, Integer width, Integer height) {
        ArtPiece piece = artPieceRepository.findById(pieceId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio piece not found: " + pieceId));

        return mapToResponseDTO(piece, true, width, height);
    }

    @Transactional(readOnly = true)
    public ArtPieceResponseDTO getMyArtwork(UUID pieceId) {
        return getMyArtwork(pieceId, 400, 300);
    }

    @Transactional(readOnly = true)
    public ArtPieceResponseDTO getMyArtwork(UUID pieceId, Integer width, Integer height) {
        User user = getCurrentUser();
        ArtPiece piece = getOwnedPiece(pieceId, user);
        return mapToResponseDTO(piece, true, width, height);
    }

    @Transactional(readOnly = true)
    public ArtPieceResponseDTO getArtworkById(UUID pieceId) {
        return getArtworkById(pieceId, 400, 300);
    }

    @Transactional(readOnly = true)
    public ArtPieceResponseDTO getArtworkById(UUID pieceId, Integer width, Integer height) {
        ArtPiece piece = artPieceRepository.findById(pieceId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio piece not found: " + pieceId));

        // If it's a draft, verify ownership
        if (!piece.isPublished()) {
            User currentUser = getCurrentUser();
            if (!piece.getUser().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Unauthorized: This artwork is a draft.");
            }
        }

        return mapToResponseDTO(piece, true, width, height);
    }

    @Transactional(readOnly = true)
    public PaginatedResponse<ArtPieceResponseDTO> getMyPortfolio(int page, int limit) {
        User user = getCurrentUser();
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<ArtPiece> piecesPage = artPieceRepository.findByUserId(user.getId(), pageRequest);

        return mapToPaginatedResponse(piecesPage, page, limit);
    }

    private ArtPieceResponseDTO mapToResponseDTO(ArtPiece piece, boolean includeAllAssets) {
        return mapToResponseDTO(piece, includeAllAssets, 400, 300);
    }

    private ArtPieceResponseDTO mapToResponseDTO(ArtPiece piece, boolean includeAllAssets, Integer width, Integer height) {
        int w = width != null ? width : 400;
        int h = height != null ? height : 300;
        ArtPieceAsset cover = piece.getCoverImage();
        List<ArtPieceAssetResponseDTO> assetDTOs;

        if (includeAllAssets) {
            List<ArtPieceAsset> assets = piece.getAssets();
            assetDTOs = assets.stream()
                    .map(a -> ArtPieceAssetResponseDTO.builder()
                            .id(a.getId())
                            .blobUrl(a.getBlobUrl() != null ? a.getBlobUrl() : "")
                            .sequenceOrder(a.getSequenceOrder())
                            .downloadUrl(generatePresignedGetUrl(a.getBlobPath(), w, h))
                            .build())
                    .toList();
        } else {
            assetDTOs = cover != null
                    ? List.of(ArtPieceAssetResponseDTO.builder()
                            .id(cover.getId())
                            .blobUrl(cover.getBlobUrl() != null ? cover.getBlobUrl() : "")
                            .sequenceOrder(cover.getSequenceOrder())
                            .downloadUrl(generatePresignedGetUrl(cover.getBlobPath(), w, h))
                            .build())
                    : List.of();
        }

        return ArtPieceResponseDTO.builder()
                .id(piece.getId())
                .title(piece.getTitle())
                .description(piece.getDescription() != null ? piece.getDescription() : "")
                .coverImage(cover != null ? generatePresignedGetUrl(cover.getBlobPath(), w, h) : "")
                .assetCount(piece.getAssetCount())
                .createdAt(piece.getCreatedAt().toString())
                .isPublished(piece.isPublished())
                .userId(piece.getUser().getId())
                .keycloakId(piece.getUser().getKeycloakId())
                .username(piece.getUser().getUsername())
                .artistAvatarUrl(piece.getUser().getAvatarUrl())
                .isForSale(piece.isForSale())
                .price(piece.getPrice())
                .currency(piece.getCurrency())
                .assets(assetDTOs)
                .build();
    }

    private PaginatedResponse<ArtPieceResponseDTO> mapToPaginatedResponse(Page<ArtPiece> piecesPage, int page,
            int limit) {
        List<ArtPieceResponseDTO> data = piecesPage.getContent().stream()
                .map(piece -> mapToResponseDTO(piece, false))
                .toList();

        return PaginatedResponse.of(data, piecesPage.getTotalElements(), page, limit);
    }

    @Transactional
    public ArtPieceResponseDTO createPiece(ArtPieceCreateRequestDTO request) {
        User user = getCurrentUser();

        ArtPiece piece = ArtPiece.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .tags(request.getTags())
                .commissionId(request.getCommissionId())
                .isPublished(request.isPublished())
                .build();

        if (request.getFiles() != null) {
            int sequence = 0;
            for (ArtPieceCreateRequestDTO.UploadFileDTO fileDto : request.getFiles()) {
                String clientFileName = fileDto.getClientFileName();
                String contentType = fileDto.getContentType();

                String sanitizedName = clientFileName.replaceAll("\\s+", "_").toLowerCase();
                String uniqueId = UUID.randomUUID().toString().substring(0, 6);
                String blobPath = uniqueId + "-" + sanitizedName;

                ArtPieceAsset asset = ArtPieceAsset.builder()
                        .blobPath(blobPath)
                        .blobUrl(String.format("%s/%s", s3UrlBase, blobPath))
                        .fileSizeBytes(1024L) // Placeholder
                        .fileType(contentType != null ? contentType : "image/png")
                        .sequenceOrder(sequence++)
                        .build();
                piece.addAsset(asset);
            }
        }

        ArtPiece saved = artPieceRepository.save(piece);

        user.setPortfolioCount(user.getPortfolioCount() + 1);
        userRepository.save(user);

        List<ArtPieceAssetResponseDTO> assetDTOs = saved.getAssets().stream()
                .map(a -> ArtPieceAssetResponseDTO.builder()
                        .id(a.getId())
                        .blobUrl(a.getBlobUrl())
                        .sequenceOrder(a.getSequenceOrder())
                        .uploadUrl(generatePresignedUrl(a.getBlobPath(), a.getFileType()))
                        .downloadUrl(generatePresignedGetUrl(a.getBlobPath()))
                        .build())
                .toList();

        return ArtPieceResponseDTO.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .userId(user.getId())
                .keycloakId(user.getKeycloakId())
                .username(user.getUsername())
                .artistAvatarUrl(user.getAvatarUrl())
                .isPublished(saved.isPublished())
                .createdAt(saved.getCreatedAt().toString())
                .isForSale(saved.isForSale())
                .price(saved.getPrice())
                .currency(saved.getCurrency())
                .assets(assetDTOs)
                .build();
    }

    public String generatePresignedUrl(String blobPath, String contentType) {
        try {
            software.amazon.awssdk.services.s3.model.PutObjectRequest putObjectRequest = software.amazon.awssdk.services.s3.model.PutObjectRequest
                    .builder()
                    .bucket(bucketName)
                    .key(blobPath)
                    .contentType(contentType)
                    .build();

            software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest presignRequest = software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest
                    .builder()
                    .signatureDuration(java.time.Duration.ofMinutes(15))
                    .putObjectRequest(putObjectRequest)
                    .build();

            software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest presignedRequest = s3Presigner
                    .presignPutObject(presignRequest);

            return presignedRequest.url().toString();
        } catch (Exception e) {
            log.error("Failed to generate presigned S3 upload URL for key: {}, contentType: {}", blobPath, contentType,
                    e);
            return "";
        }
    }

    public String generatePresignedGetUrl(String blobPath) {
        return generatePresignedGetUrl(blobPath, 400, 300);
    }

    public String generatePresignedGetUrl(String blobPath, int width, int height) {
        if (blobPath == null || blobPath.isBlank()) {
            return "";
        }
        return String.format("%s/insecure/resize:fill:%d:%d/plain/s3://%s/%s@webp",
                imgproxyUrl, width, height, bucketName, blobPath);
    }

    @Transactional
    public SimpleMessageResponseDTO reorderAssets(UUID pieceId, List<UUID> assetIds) {
        User user = getCurrentUser();
        ArtPiece piece = getOwnedPiece(pieceId, user);

        List<ArtPieceAsset> assets = piece.getAssets();
        for (int i = 0; i < assetIds.size(); i++) {
            UUID assetId = assetIds.get(i);
            ArtPieceAsset asset = assets.stream()
                    .filter(a -> a.getId().equals(assetId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + assetId));

            asset.setSequenceOrder(i);
        }

        artPieceRepository.save(piece);
        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Assets reordered")
                .build();
    }

    @Transactional
    public SimpleMessageResponseDTO updatePiece(UUID pieceId, ArtPieceUpdateRequestDTO request) {
        User user = getCurrentUser();
        ArtPiece piece = getOwnedPiece(pieceId, user);

        if (request.getTitle() != null)
            piece.setTitle(request.getTitle());
        if (request.getDescription() != null)
            piece.setDescription(request.getDescription());
        if (request.getIsPublished() != null)
            piece.setPublished(request.getIsPublished());
        if (request.getTags() != null)
            piece.setTags(request.getTags());
        piece.setUpdatedAt(Instant.now());

        artPieceRepository.save(piece);
        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Portfolio piece updated")
                .build();
    }

    @Transactional
    public SimpleMessageResponseDTO deletePiece(UUID pieceId) {
        User user = getCurrentUser();
        ArtPiece piece = getOwnedPiece(pieceId, user);

        artPieceRepository.delete(piece);

        user.setPortfolioCount(Math.max(0, user.getPortfolioCount() - 1));
        userRepository.save(user);

        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Portfolio piece deleted")
                .build();
    }

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private ArtPiece getOwnedPiece(UUID pieceId, User user) {
        ArtPiece piece = artPieceRepository.findById(pieceId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio piece not found: " + pieceId));
        if (!piece.getUser().getId().equals(user.getId())) {
            throw new BusinessLogicException("You do not own this portfolio piece");
        }
        return piece;
    }
}
