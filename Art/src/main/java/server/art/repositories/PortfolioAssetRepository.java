package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.PortfolioAsset;

import java.util.List;
import java.util.UUID;

@Repository
public interface PortfolioAssetRepository extends JpaRepository<PortfolioAsset, UUID> {

    List<PortfolioAsset> findByArtPieceIdOrderBySequenceOrderAsc(UUID artPieceId);

    long countByArtPieceId(UUID artPieceId);
}
