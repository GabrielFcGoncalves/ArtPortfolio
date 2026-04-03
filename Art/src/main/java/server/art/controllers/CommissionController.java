package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.commission.*;
import server.art.data.dto.common.*;
import server.art.dto.PaginatedResponse;
import server.art.services.CommissionService;

import java.util.UUID;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
public class CommissionController {

    private final CommissionService commissionService;

    @PostMapping
    public ResponseEntity<CommissionDetailResponseDTO> createCommission(@RequestBody CommissionCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commissionService.createCommission(request));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<CommissionSummaryDTO>> listCommissions(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(commissionService.listCommissions(role, status, page, limit));
    }

    @GetMapping("/{commissionId}")
    public ResponseEntity<CommissionDetailResponseDTO> getCommissionDetail(@PathVariable UUID commissionId) {
        return ResponseEntity.ok(commissionService.getCommissionDetail(commissionId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommissionDetailResponseDTO> updateCommission(
            @PathVariable UUID id, 
            @RequestBody CommissionUpdateRequestDTO request) {
        return ResponseEntity.ok(commissionService.updateCommission(id, request));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<SimpleMessageResponseDTO> cancelCommission(
            @PathVariable UUID id, 
            @RequestBody CommissionCancelRequestDTO request) {
        commissionService.cancelCommission(id, request.getReason());
        return ResponseEntity.ok(SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Commission cancelled")
                .build());
    }
}
