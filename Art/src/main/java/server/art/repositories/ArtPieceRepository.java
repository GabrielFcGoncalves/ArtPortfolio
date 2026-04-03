package server.art.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.ArtPiece;

import java.util.UUID;

@Repository
public interface ArtPieceRepository extends JpaRepository<ArtPiece, UUID> {

    Page<ArtPiece> findByUserIdAndIsPublishedTrue(UUID userId, Pageable pageable);

    Page<ArtPiece> findByUserId(UUID userId, Pageable pageable);

    long countByUserId(UUID userId);
}
