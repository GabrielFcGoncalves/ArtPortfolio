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
import server.art.data.dto.portfolio.*;
import server.art.data.dto.common.*;
import server.art.dto.PaginatedResponse;
import server.art.services.PortfolioService;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/api/users/{userId}/portfolio")
    public ResponseEntity<PaginatedResponse<ArtPieceResponseDTO>> getPortfolio(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(portfolioService.getPortfolio(userId, page, limit));
    }

    @PostMapping("/api/users/me/portfolio")
    public ResponseEntity<ArtPieceResponseDTO> createPiece(@RequestBody ArtPieceCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(portfolioService.createPiece(request));
    }

    @PatchMapping("/api/users/me/portfolio/{pieceId}")
    public ResponseEntity<SimpleMessageResponseDTO> updatePiece(
            @PathVariable UUID pieceId, 
            @RequestBody ArtPieceUpdateRequestDTO request) {
        return ResponseEntity.ok(portfolioService.updatePiece(pieceId, request));
    }

    @DeleteMapping("/api/users/me/portfolio/{pieceId}")
    public ResponseEntity<SimpleMessageResponseDTO> deletePiece(@PathVariable UUID pieceId) {
        return ResponseEntity.ok(portfolioService.deletePiece(pieceId));
    }
}
