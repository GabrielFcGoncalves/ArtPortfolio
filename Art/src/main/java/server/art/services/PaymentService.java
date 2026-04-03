package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.Commission;
import server.art.data.Dispute;
import server.art.data.Payment;
import server.art.data.User;
import server.art.data.enums.CommissionStatus;
import server.art.data.enums.EscrowStatus;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.CommissionRepository;
import server.art.repositories.DisputeRepository;
import server.art.repositories.PaymentRepository;
import server.art.repositories.UserRepository;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final CommissionRepository commissionRepository;
    private final DisputeRepository disputeRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    /**
     * Create a Stripe Checkout session for the commission.
     * TODO: Integrate real Stripe SDK when keys are configured.
     */
    @Transactional
    public Map<String, Object> createPaymentSession(UUID commissionId) {
        User user = getCurrentUser();
        Commission commission = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));

        if (!commission.getClient().getId().equals(user.getId())) {
            throw new BusinessLogicException("Only the client can initiate payment");
        }

        if (commission.getStatus() != CommissionStatus.REQUESTED) {
            throw new BusinessLogicException("Commission must be in REQUESTED status to create payment");
        }

        // Stub: In production, this would call Stripe.checkout.sessions.create()
        String stubSessionId = "cs_stub_" + UUID.randomUUID();
        String stubCheckoutUrl = "https://checkout.stripe.com/pay/" + stubSessionId;

        Payment payment = Payment.builder()
                .commission(commission)
                .amountCents(commission.getTotalPriceCents())
                .stripeSessionId(stubSessionId)
                .build();
        paymentRepository.save(payment);

        return Map.of(
                "session_id", stubSessionId,
                "checkout_url", stubCheckoutUrl
        );
    }

    /**
     * Handle Stripe webhook events.
     * TODO: Add real Stripe signature validation.
     */
    @Transactional
    public void handleWebhookEvent(String eventType, Map<String, Object> eventData) {
        switch (eventType) {
            case "checkout.session.completed" -> handleCheckoutCompleted(eventData);
            case "charge.refunded" -> handleChargeRefunded(eventData);
            case "charge.dispute.created" -> handleDisputeCreated(eventData);
            default -> { /* ignore unknown events */ }
        }
    }

    private void handleCheckoutCompleted(Map<String, Object> eventData) {
        String sessionId = (String) eventData.get("session_id");
        Payment payment = paymentRepository.findByStripeSessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for session: " + sessionId));

        payment.setStatus("SUCCEEDED");
        payment.setCompletedAt(Instant.now());
        paymentRepository.save(payment);

        Commission commission = payment.getCommission();
        commission.setStatus(CommissionStatus.PAID);
        commission.setEscrowStatus(EscrowStatus.HELD);
        commission.setStripePaymentId(sessionId);
        commissionRepository.save(commission);
    }

    private void handleChargeRefunded(Map<String, Object> eventData) {
        // Stub implementation
    }

    private void handleDisputeCreated(Map<String, Object> eventData) {
        // Stub implementation
    }

    public Map<String, Object> getPaymentStatus(UUID commissionId) {
        Payment payment = paymentRepository.findByCommissionId(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment found for commission: " + commissionId));

        return Map.of(
                "status", payment.getStatus(),
                "amount_cents", payment.getAmountCents(),
                "stripe_payment_id", payment.getStripePaymentId() != null ? payment.getStripePaymentId() : "",
                "created_at", payment.getCreatedAt().toString(),
                "completed_at", payment.getCompletedAt() != null ? payment.getCompletedAt().toString() : ""
        );
    }

    @Transactional
    public Map<String, Object> requestRefund(UUID commissionId, String reason) {
        User user = getCurrentUser();
        Commission commission = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));

        if (!commission.getClient().getId().equals(user.getId())) {
            throw new BusinessLogicException("Only the client can request a refund");
        }

        if (commission.getStatus() == CommissionStatus.COMPLETED) {
            throw new BusinessLogicException("Cannot refund a completed commission");
        }

        Dispute dispute = Dispute.builder()
                .commission(commission)
                .initiatedById(user.getId())
                .reason(reason)
                .build();
        disputeRepository.save(dispute);

        return Map.of("success", true, "message", "Refund requested");
    }

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }
}
