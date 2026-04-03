package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.BlockedUser;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, UUID> {

    Optional<BlockedUser> findByBlockerIdAndBlockedId(UUID blockerId, UUID blockedId);

    boolean existsByBlockerIdAndBlockedId(UUID blockerId, UUID blockedId);

    void deleteByBlockerIdAndBlockedId(UUID blockerId, UUID blockedId);
}
