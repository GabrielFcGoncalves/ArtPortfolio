package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.payment.PaymentSessionResponseDTO;
import server.art.services.PurchaseService;
import java.util.UUID;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping("/{pieceId}/purchase")
    public ResponseEntity<PaymentSessionResponseDTO> createCheckoutSession(@PathVariable UUID pieceId) {
        return ResponseEntity.ok(purchaseService.createCheckoutSession(pieceId));
    }
}
