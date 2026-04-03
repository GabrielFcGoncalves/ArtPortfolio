package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.art.dto.PaginatedResponse;
import server.art.services.AdminService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/users")
    public ResponseEntity<PaginatedResponse<Map<String, Object>>> listUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(adminService.listUsers(page, limit));
    }

    @PostMapping("/users/{id}/verify")
    public ResponseEntity<Map<String, Object>> verifyArtist(@PathVariable UUID id) {
        return ResponseEntity.ok(adminService.verifyArtist(id));
    }

    @PostMapping("/users/{id}/suspend")
    public ResponseEntity<Map<String, Object>> suspendUser(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(adminService.suspendUser(id, body.get("reason")));
    }

    @GetMapping("/disputes")
    public ResponseEntity<PaginatedResponse<Map<String, Object>>> listDisputes(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "all") String status) {
        return ResponseEntity.ok(adminService.listDisputes(page, limit, status));
    }

    @PostMapping("/disputes/{id}/resolve")
    public ResponseEntity<Map<String, Object>> resolveDispute(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(adminService.resolveDispute(id, body.get("resolution"), body.get("resolution_type")));
    }
}
