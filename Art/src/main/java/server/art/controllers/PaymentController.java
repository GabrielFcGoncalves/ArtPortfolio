package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.payment.*;
import server.art.data.dto.common.*;
import server.art.services.PaymentService;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/api/commissions/{commissionId}/create-payment")
    public ResponseEntity<PaymentSessionResponseDTO> createPayment(@PathVariable UUID commissionId) {
        return ResponseEntity.ok(paymentService.createPaymentSession(commissionId));
    }

    @GetMapping("/api/commissions/{commissionId}/payment-status")
    public ResponseEntity<PaymentStatusResponseDTO> getPaymentStatus(@PathVariable UUID commissionId) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(commissionId));
    }

    @PostMapping("/api/commissions/{commissionId}/request-refund")
    public ResponseEntity<SimpleMessageResponseDTO> requestRefund(
            @PathVariable UUID commissionId,
            @RequestBody RefundRequestDTO request) {
        return ResponseEntity.ok(paymentService.requestRefund(commissionId, request));
    }
}
