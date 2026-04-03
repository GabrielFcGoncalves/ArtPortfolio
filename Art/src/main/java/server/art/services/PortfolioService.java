package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.ArtPiece;
import server.art.data.PortfolioAsset;
import server.art.data.User;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.ArtPieceRepository;
import server.art.repositories.PortfolioAssetRepository;
import server.art.repositories.UserRepository;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final ArtPieceRepository artPieceRepository;
    private final PortfolioAssetRepository portfolioAssetRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    public PaginatedResponse<Map<String, Object>> getPortfolio(UUID userId, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<ArtPiece> piecesPage = artPieceRepository.findByUserIdAndIsPublishedTrue(userId, pageRequest);

        List<Map<String, Object>> data = piecesPage.getContent().stream()
                .map(piece -> {
                    List<PortfolioAsset> assets = portfolioAssetRepository
                            .findByArtPieceIdOrderBySequenceOrderAsc(piece.getId());
                    List<Map<String, Object>> assetMaps = assets.stream()
                            .map(a -> Map.<String, Object>of(
                                    "id", a.getId(),
                                    "blob_url", a.getBlobUrl() != null ? a.getBlobUrl() : "",
                                    "sequence_order", a.getSequenceOrder()
                            ))
                            .toList();
                    return Map.<String, Object>of(
                            "id", piece.getId(),
                            "title", piece.getTitle(),
                            "description", piece.getDescription() != null ? piece.getDescription() : "",
                            "cover_image", piece.getCoverImage() != null ? piece.getCoverImage() : "",
                            "asset_count", piece.getAssetCount(),
                            "created_at", piece.getCreatedAt().toString(),
                            "assets", assetMaps
                    );
                })
                .toList();

        return PaginatedResponse.of(data, piecesPage.getTotalElements(), page, limit);
    }

    @Transactional
    public Map<String, Object> createPiece(String title, String description, String tags,
                                            UUID commissionId, boolean isPublished) {
        User user = getCurrentUser();

        ArtPiece piece = ArtPiece.builder()
                .user(user)
                .title(title)
                .description(description)
                .tags(tags)
                .commissionId(commissionId)
                .isPublished(isPublished)
                .build();

        ArtPiece saved = artPieceRepository.save(piece);

        user.setPortfolioCount(user.getPortfolioCount() + 1);
        userRepository.save(user);

        return Map.of("portfolio_piece", Map.of(
                "id", saved.getId(),
                "title", saved.getTitle(),
                "user_id", user.getId(),
                "is_published", saved.isPublished(),
                "created_at", saved.getCreatedAt().toString()
        ));
    }

    @Transactional
    public Map<String, Object> updatePiece(UUID pieceId, String title, String description,
                                            Boolean isPublished, String tags) {
        User user = getCurrentUser();
        ArtPiece piece = getOwnedPiece(pieceId, user);

        if (title != null) piece.setTitle(title);
        if (description != null) piece.setDescription(description);
        if (isPublished != null) piece.setPublished(isPublished);
        if (tags != null) piece.setTags(tags);
        piece.setUpdatedAt(Instant.now());

        ArtPiece saved = artPieceRepository.save(piece);
        return Map.of("success", true, "portfolio_piece", Map.of(
                "id", saved.getId(),
                "title", saved.getTitle()
        ));
    }

    @Transactional
    public Map<String, Object> deletePiece(UUID pieceId) {
        User user = getCurrentUser();
        ArtPiece piece = getOwnedPiece(pieceId, user);

        artPieceRepository.delete(piece);

        user.setPortfolioCount(Math.max(0, user.getPortfolioCount() - 1));
        userRepository.save(user);

        return Map.of("success", true, "message", "Portfolio piece deleted");
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
