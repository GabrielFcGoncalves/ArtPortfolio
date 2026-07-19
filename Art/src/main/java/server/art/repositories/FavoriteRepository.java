package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.Favorite;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    Optional<Favorite> findByUserIdAndArtPieceId(UUID userId, UUID artPieceId);
    boolean existsByUserIdAndArtPieceId(UUID userId, UUID artPieceId);
    void deleteByUserIdAndArtPieceId(UUID userId, UUID artPieceId);
    long countByArtPieceId(UUID artPieceId);
}
