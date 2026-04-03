package server.art.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import server.art.data.Message;

import java.util.UUID;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    Page<Message> findByCommissionIdOrderByCreatedAtDesc(UUID commissionId, Pageable pageable);

    long countByCommissionId(UUID commissionId);
}
