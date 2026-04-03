package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.art.dto.PaginatedResponse;
import server.art.services.PortfolioService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/api/users/{userId}/portfolio")
    public ResponseEntity<PaginatedResponse<Map<String, Object>>> getPortfolio(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(portfolioService.getPortfolio(userId, page, limit));
    }

    @PostMapping("/api/users/me/portfolio")
    public ResponseEntity<Map<String, Object>> createPiece(@RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        String tags = (String) body.get("tags");
        UUID commissionId = body.containsKey("commission_id") ? UUID.fromString((String) body.get("commission_id")) : null;
        boolean isPublished = body.containsKey("is_published") ? (Boolean) body.get("is_published") : true;

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(portfolioService.createPiece(title, description, tags, commissionId, isPublished));
    }

    @PatchMapping("/api/users/me/portfolio/{pieceId}")
    public ResponseEntity<Map<String, Object>> updatePiece(@PathVariable UUID pieceId, @RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        Boolean isPublished = body.containsKey("is_published") ? (Boolean) body.get("is_published") : null;
        String tags = (String) body.get("tags");

        return ResponseEntity.ok(portfolioService.updatePiece(pieceId, title, description, isPublished, tags));
    }

    @DeleteMapping("/api/users/me/portfolio/{pieceId}")
    public ResponseEntity<Map<String, Object>> deletePiece(@PathVariable UUID pieceId) {
        return ResponseEntity.ok(portfolioService.deletePiece(pieceId));
    }
}
