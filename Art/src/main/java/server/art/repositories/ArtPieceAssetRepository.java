package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.ArtPieceAsset;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArtPieceAssetRepository extends JpaRepository<ArtPieceAsset, UUID> {
    List<ArtPieceAsset> findByArtPieceIdOrderBySequenceOrderAsc(UUID artPieceId);
}
