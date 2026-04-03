package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.art.data.Commission;
import server.art.dto.PaginatedResponse;
import server.art.services.CommissionService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService commissionService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createCommission(@RequestBody Map<String, Object> body) {
        UUID artistId = UUID.fromString((String) body.get("artist_id"));
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        long totalPriceCents = ((Number) body.get("total_price_cents")).longValue();
        boolean isPhysical = body.containsKey("is_physical") && (Boolean) body.get("is_physical");
        int revisionLimit = body.containsKey("revision_limit") ? ((Number) body.get("revision_limit")).intValue() : 3;
        String dueDate = (String) body.get("due_date");

        Commission commission = commissionService.createCommission(
                artistId, title, description, totalPriceCents, isPhysical, revisionLimit, dueDate);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "commission", Map.of(
                        "id", commission.getId(),
                        "artist_id", commission.getArtist().getId(),
                        "client_id", commission.getClient().getId(),
                        "title", commission.getTitle(),
                        "total_price_cents", commission.getTotalPriceCents(),
                        "status", commission.getStatus().name(),
                        "escrow_status", commission.getEscrowStatus().name(),
                        "created_at", commission.getCreatedAt().toString()
                )
        ));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<Map<String, Object>>> listCommissions(
            @RequestParam(defaultValue = "all") String role,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(commissionService.listCommissions(role, status, page, limit));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCommission(@PathVariable UUID id) {
        return ResponseEntity.ok(commissionService.getCommissionDetail(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateCommission(@PathVariable UUID id, @RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        Integer revisionLimit = body.containsKey("revision_limit") ? ((Number) body.get("revision_limit")).intValue() : null;

        Commission updated = commissionService.updateCommission(id, title, description, revisionLimit);
        return ResponseEntity.ok(Map.of("success", true, "commission", Map.of(
                "id", updated.getId(),
                "title", updated.getTitle(),
                "status", updated.getStatus().name()
        )));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelCommission(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        commissionService.cancelCommission(id, body.get("reason"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Commission cancelled"));
    }
}
