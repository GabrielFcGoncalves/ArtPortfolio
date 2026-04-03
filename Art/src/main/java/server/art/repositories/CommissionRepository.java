package server.art.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.Commission;
import server.art.data.enums.CommissionStatus;

import java.util.UUID;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, UUID> {

    Page<Commission> findByClientId(UUID clientId, Pageable pageable);

    Page<Commission> findByArtistId(UUID artistId, Pageable pageable);

    Page<Commission> findByClientIdOrArtistId(UUID clientId, UUID artistId, Pageable pageable);

    Page<Commission> findByClientIdAndStatus(UUID clientId, CommissionStatus status, Pageable pageable);

    Page<Commission> findByArtistIdAndStatus(UUID artistId, CommissionStatus status, Pageable pageable);

    long countByStatus(CommissionStatus status);

    long countByArtistId(UUID artistId);
}
