package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.ArtPiece;
import server.art.data.ArtPieceView;
import server.art.data.dto.common.SimpleMessageResponseDTO;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.ArtPieceRepository;
import server.art.repositories.ArtPieceViewRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ViewService {

    private final ArtPieceViewRepository artPieceViewRepository;
    private final ArtPieceRepository artPieceRepository;
    private final IdentityService identityService;

    @Transactional
    public SimpleMessageResponseDTO recordView(UUID pieceId) {
        String keycloakId = null;
        try {
            keycloakId = identityService.getCurrentUserSub();
        } catch (Exception e) {
            // Anonymous view
        }

        ArtPiece piece = artPieceRepository.findById(pieceId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio piece not found: " + pieceId));

        boolean shouldRecord = true;
        if (keycloakId != null) {
            Instant oneDayAgo = Instant.now().minus(24, ChronoUnit.HOURS);
            boolean hasRecentView = artPieceViewRepository.existsByArtPieceIdAndViewerKeycloakIdAndViewedAtAfter(pieceId, keycloakId, oneDayAgo);
            if (hasRecentView) {
                shouldRecord = false;
            }
        }

        if (shouldRecord) {
            ArtPieceView view = ArtPieceView.builder()
                    .artPiece(piece)
                    .viewerKeycloakId(keycloakId)
                    .build();
            artPieceViewRepository.save(view);

            piece.setViewCount(piece.getViewCount() + 1);
            artPieceRepository.save(piece);
        }

        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("View recorded")
                .build();
    }
}
