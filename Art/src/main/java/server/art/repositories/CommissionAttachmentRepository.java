package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.CommissionAttachment;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommissionAttachmentRepository extends JpaRepository<CommissionAttachment, UUID> {

    List<CommissionAttachment> findByCommissionId(UUID commissionId);
}
