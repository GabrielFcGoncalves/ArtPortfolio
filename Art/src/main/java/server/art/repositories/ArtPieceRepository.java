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

    @Query("SELECT a FROM ArtPiece a WHERE a.isPublished = true " +
           "AND (:category IS NULL OR a.category = :category) " +
           "AND (:search IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.tags) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ArtPiece> findByFilters(
            @Param("category") String category,
            @Param("search") String search,
            Pageable pageable);
}
