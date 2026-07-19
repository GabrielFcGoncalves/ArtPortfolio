package server.art.controllers;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.common.SimpleMessageResponseDTO;
import server.art.services.PaymentService;
import server.art.services.PurchaseService;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final PaymentService paymentService;
    private final PurchaseService purchaseService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping("/stripe")
    public ResponseEntity<SimpleMessageResponseDTO> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Invalid signature for Stripe webhook", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error processing Stripe webhook payload", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            StripeObject stripeObject = dataObjectDeserializer.getObject().orElse(null);
            
            if (stripeObject instanceof Session session) {
                Map<String, String> metadata = session.getMetadata();
                if (metadata != null && "purchase".equals(metadata.get("type"))) {
                    purchaseService.handlePurchaseCompleted(session);
                } else {
                    // Legacy stub-based commission logic
                    // In a real system, you'd use the same Stripe session flow for commissions
                    // But for this stub implementation, we'll try to map it back
                    // This won't work well since the legacy code expects a Map
                    // So we will just log it for now
                    log.info("Received checkout.session.completed for non-purchase type. Legacy commissions might be stubbed.");
                }
            }
        }

        return ResponseEntity.ok(SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Webhook processed")
                .build());
    }
}
