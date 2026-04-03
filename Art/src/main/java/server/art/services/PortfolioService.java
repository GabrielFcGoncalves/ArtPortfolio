package server.art.services;

import lombok.RequiredArgsConstructor;
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
import server.art.repositories.ArtPieceAssetRepository;
import server.art.repositories.ArtPieceRepository;
import server.art.repositories.UserRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final ArtPieceRepository artPieceRepository;
    private final ArtPieceAssetRepository artPieceAssetRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    public PaginatedResponse<ArtPieceResponseDTO> getPortfolio(UUID userId, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<ArtPiece> piecesPage = artPieceRepository.findByUserIdAndIsPublishedTrue(userId, pageRequest);

        List<ArtPieceResponseDTO> data = piecesPage.getContent().stream()
                .map(piece -> {
                    List<ArtPieceAsset> assets = artPieceAssetRepository
                            .findByArtPieceIdOrderBySequenceOrderAsc(piece.getId());
                    List<ArtPieceAssetResponseDTO> assetDTOs = assets.stream()
                            .map(a -> ArtPieceAssetResponseDTO.builder()
                                    .id(a.getId())
                                    .blobUrl(a.getBlobUrl() != null ? a.getBlobUrl() : "")
                                    .sequenceOrder(a.getSequenceOrder())
                                    .build())
                            .toList();
                    ArtPieceAsset cover = piece.getCoverImage();
                    return ArtPieceResponseDTO.builder()
                            .id(piece.getId())
                            .title(piece.getTitle())
                            .description(piece.getDescription() != null ? piece.getDescription() : "")
                            .coverImage(cover != null ? cover.getBlobUrl() : "")
                            .assetCount(piece.getAssetCount())
                            .createdAt(piece.getCreatedAt().toString())
                            .assets(assetDTOs)
                            .build();
                })
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

        ArtPiece saved = artPieceRepository.save(piece);

        user.setPortfolioCount(user.getPortfolioCount() + 1);
        userRepository.save(user);

        return ArtPieceResponseDTO.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .userId(user.getId())
                .isPublished(saved.isPublished())
                .createdAt(saved.getCreatedAt().toString())
                .build();
    }

    @Transactional
    public SimpleMessageResponseDTO updatePiece(UUID pieceId, ArtPieceUpdateRequestDTO request) {
        User user = getCurrentUser();
        ArtPiece piece = getOwnedPiece(pieceId, user);

        if (request.getTitle() != null) piece.setTitle(request.getTitle());
        if (request.getDescription() != null) piece.setDescription(request.getDescription());
        if (request.getIsPublished() != null) piece.setPublished(request.getIsPublished());
        if (request.getTags() != null) piece.setTags(request.getTags());
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
