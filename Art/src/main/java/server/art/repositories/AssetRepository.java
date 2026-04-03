package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.Asset;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssetRepository extends JpaRepository<Asset, UUID> {

    List<Asset> findByMilestoneIdAndIsDeletedFalse(UUID milestoneId);

    long countByMilestoneIdAndIsDeletedFalse(UUID milestoneId);
}
