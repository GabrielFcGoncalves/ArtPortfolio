package server.art.services;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.ArtPiece;
import server.art.data.Purchase;
import server.art.data.User;
import server.art.data.dto.payment.PaymentSessionResponseDTO;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.ArtPieceRepository;
import server.art.repositories.PurchaseRepository;
import server.art.repositories.UserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final ArtPieceRepository artPieceRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    @Value("${stripe.platform-fee-percent}")
    private int platformFeePercent;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Transactional
    public PaymentSessionResponseDTO createCheckoutSession(UUID pieceId) {
        User buyer = getCurrentUser();
        ArtPiece piece = artPieceRepository.findById(pieceId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio piece not found: " + pieceId));

        if (!piece.isPublished()) {
            throw new BusinessLogicException("Cannot purchase an unpublished piece");
        }
        if (!piece.isForSale()) {
            throw new BusinessLogicException("This piece is not for sale");
        }
        if (piece.getPrice() == null || piece.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessLogicException("Price must be greater than zero");
        }
        if (piece.getUser().getId().equals(buyer.getId())) {
            throw new BusinessLogicException("You cannot buy your own artwork");
        }
        if (purchaseRepository.existsByArtPieceIdAndStatus(pieceId, "SUCCEEDED")) {
            throw new BusinessLogicException("This piece has already been sold");
        }

        long amountCents = piece.getPrice().multiply(BigDecimal.valueOf(100)).longValue();
        long platformFeeCents = amountCents * platformFeePercent / 100;

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendUrl + "/purchase-success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendUrl + "/purchase-cancel?piece_id=" + pieceId)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency(piece.getCurrency().toLowerCase())
                                    .setUnitAmount(amountCents)
                                    .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName(piece.getTitle())
                                            .setDescription("Original artwork by " + piece.getUser().getUsername())
                                            .build())
                                    .build())
                            .build())
                    .putMetadata("type", "purchase")
                    .putMetadata("piece_id", pieceId.toString())
                    .build();

            Session session = Session.create(params);

            Purchase purchase = Purchase.builder()
                    .buyer(buyer)
                    .artPiece(piece)
                    .amountCents(amountCents)
                    .platformFeeCents(platformFeeCents)
                    .currency(piece.getCurrency())
                    .stripeSessionId(session.getId())
                    .status("PENDING")
                    .build();
            purchaseRepository.save(purchase);

            return PaymentSessionResponseDTO.builder()
                    .sessionId(session.getId())
                    .checkoutUrl(session.getUrl())
                    .build();
        } catch (Exception e) {
            log.error("Stripe session creation failed", e);
            throw new BusinessLogicException("Failed to create checkout session: " + e.getMessage());
        }
    }

    @Transactional
    public void handlePurchaseCompleted(Session session) {
        String sessionId = session.getId();
        Purchase purchase = purchaseRepository.findByStripeSessionId(sessionId)
                .orElse(null);

        if (purchase == null) {
            log.warn("Purchase not found for Stripe session: {}", sessionId);
            return;
        }

        purchase.setStatus("SUCCEEDED");
        purchase.setCompletedAt(Instant.now());
        purchase.setStripePaymentIntentId(session.getPaymentIntent());
        purchaseRepository.save(purchase);

        ArtPiece piece = purchase.getArtPiece();
        piece.setForSale(false);
        artPieceRepository.save(piece);
        log.info("Purchase completed for piece: {}", piece.getId());
    }

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }
}
