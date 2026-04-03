package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.Milestone;

import java.util.List;
import java.util.UUID;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {

    List<Milestone> findByCommissionIdOrderBySequenceOrderAsc(UUID commissionId);

    long countByCommissionId(UUID commissionId);
}
