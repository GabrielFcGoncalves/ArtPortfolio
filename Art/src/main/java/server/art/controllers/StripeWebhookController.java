package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import server.art.data.dto.common.SimpleMessageResponseDTO;
import server.art.services.PaymentService;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class StripeWebhookController {

    private final PaymentService paymentService;

    @PostMapping("/stripe")
    public ResponseEntity<SimpleMessageResponseDTO> handleStripeWebhook(@RequestBody Map<String, Object> payload) {
        String eventType = (String) payload.get("type");

        @SuppressWarnings("unchecked")
        Map<String, Object> data = (Map<String, Object>) payload.get("data");

        @SuppressWarnings("unchecked")
        Map<String, Object> eventObject = data != null ? (Map<String, Object>) data.get("object") : Map.of();

        paymentService.handleWebhookEvent(eventType, eventObject);

        return ResponseEntity.ok(SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Webhook processed")
                .build());
    }
}
