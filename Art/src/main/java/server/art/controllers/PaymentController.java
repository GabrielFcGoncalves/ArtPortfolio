package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import server.art.services.PaymentService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/api/commissions/{commissionId}/create-payment")
    public ResponseEntity<Map<String, Object>> createPayment(@PathVariable UUID commissionId) {
        return ResponseEntity.ok(paymentService.createPaymentSession(commissionId));
    }

    @GetMapping("/api/commissions/{commissionId}/payment-status")
    public ResponseEntity<Map<String, Object>> getPaymentStatus(@PathVariable UUID commissionId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(commissionId));
    }

    @PostMapping("/api/commissions/{commissionId}/request-refund")
    public ResponseEntity<Map<String, Object>> requestRefund(
            @PathVariable UUID commissionId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(paymentService.requestRefund(commissionId, body.get("reason")));
    }
}
