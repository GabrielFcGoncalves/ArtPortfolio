package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.ArtPieceView;
import java.time.Instant;
import java.util.UUID;

@Repository
public interface ArtPieceViewRepository extends JpaRepository<ArtPieceView, UUID> {
    long countByArtPieceId(UUID artPieceId);
    boolean existsByArtPieceIdAndViewerKeycloakIdAndViewedAtAfter(UUID artPieceId, String viewerKeycloakId, Instant after);
}
