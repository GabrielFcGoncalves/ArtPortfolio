package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.RevisionRequest;

import java.util.List;
import java.util.UUID;

@Repository
public interface RevisionRequestRepository extends JpaRepository<RevisionRequest, UUID> {

    List<RevisionRequest> findByMilestoneId(UUID milestoneId);
}
