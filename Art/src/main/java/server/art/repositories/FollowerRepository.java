package server.art.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.Follower;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FollowerRepository extends JpaRepository<Follower, UUID> {

    Optional<Follower> findByFollowerIdAndFollowedId(UUID followerId, UUID followedId);

    boolean existsByFollowerIdAndFollowedId(UUID followerId, UUID followedId);

    Page<Follower> findByFollowedId(UUID followedId, Pageable pageable);

    Page<Follower> findByFollowerId(UUID followerId, Pageable pageable);

    void deleteByFollowerIdAndFollowedId(UUID followerId, UUID followedId);

    long countByFollowedId(UUID followedId);

    long countByFollowerId(UUID followerId);
}
