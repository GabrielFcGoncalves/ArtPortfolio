package server.art.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.Purchase;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {
    Optional<Purchase> findByStripeSessionId(String stripeSessionId);
    boolean existsByArtPieceIdAndStatus(UUID artPieceId, String status);
}
