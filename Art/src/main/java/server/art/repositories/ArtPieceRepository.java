package server.art.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import server.art.data.ArtPiece;

import java.util.UUID;

@Repository
public interface ArtPieceRepository extends JpaRepository<ArtPiece, UUID> {

    Page<ArtPiece> findByUserIdAndIsPublishedTrue(UUID userId, Pageable pageable);

    Page<ArtPiece> findByIsPublishedTrue(Pageable pageable);

    @Query("SELECT a FROM ArtPiece a LEFT JOIN FETCH a.assets WHERE a.user.id = :userId")
    Page<ArtPiece> findByUserId(@Param("userId") UUID userId, Pageable pageable);

    long countByUserId(UUID userId);
}
