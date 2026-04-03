package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.Commission;
import server.art.data.Dispute;
import server.art.data.Payment;
import server.art.data.User;
import server.art.data.dto.payment.*;
import server.art.data.dto.common.*;
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

    @Transactional
    public PaymentSessionResponseDTO createPaymentSession(UUID commissionId) {
        User user = getCurrentUser();
        Commission commission = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));

        if (!commission.getClient().getId().equals(user.getId())) {
            throw new BusinessLogicException("Only the client can initiate payment");
        }

        if (commission.getStatus() != CommissionStatus.REQUESTED) {
            throw new BusinessLogicException("Commission must be in REQUESTED status to create payment");
        }

        String stubSessionId = "cs_stub_" + UUID.randomUUID();
        String stubCheckoutUrl = "https://checkout.stripe.com/pay/" + stubSessionId;

        Payment payment = Payment.builder()
                .commission(commission)
                .amountCents(commission.getTotalPriceCents())
                .stripeSessionId(stubSessionId)
                .status("PENDING")
                .build();
        paymentRepository.save(payment);

        return PaymentSessionResponseDTO.builder()
                .sessionId(stubSessionId)
                .checkoutUrl(stubCheckoutUrl)
                .build();
    }

    @Transactional
    public void handleWebhookEvent(String eventType, Map<String, Object> eventData) {
        switch (eventType) {
            case "checkout.session.completed" -> handleCheckoutCompleted(eventData);
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

    public PaymentStatusResponseDTO getPaymentStatus(UUID commissionId) {
        Payment payment = paymentRepository.findByCommissionId(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment found for commission: " + commissionId));

        return PaymentStatusResponseDTO.builder()
                .status(payment.getStatus())
                .amountCents(payment.getAmountCents())
                .stripePaymentId(payment.getStripePaymentId() != null ? payment.getStripePaymentId() : "")
                .createdAt(payment.getCreatedAt().toString())
                .completedAt(payment.getCompletedAt() != null ? payment.getCompletedAt().toString() : "")
                .build();
    }

    @Transactional
    public SimpleMessageResponseDTO requestRefund(UUID commissionId, RefundRequestDTO request) {
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
                .reason(request.getReason())
                .status("OPEN")
                .build();
        disputeRepository.save(dispute);

        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Refund requested")
                .build();
    }

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }
}
