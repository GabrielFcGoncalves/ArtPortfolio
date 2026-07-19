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
import server.art.data.ArtPiece;
import server.art.data.dto.portfolio.*;
import server.art.data.dto.common.*;
import server.art.dto.PaginatedResponse;
import server.art.services.PortfolioService;
import java.util.Optional;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/api/portfolio")
    public ResponseEntity<PaginatedResponse<ArtPieceResponseDTO>> getAllArtworks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(portfolioService.getAllArtworks(page, limit, category, search, sort));
    }

    @GetMapping("/api/users/{userId}/portfolio")
    public ResponseEntity<PaginatedResponse<ArtPieceResponseDTO>> getPortfolio(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(portfolioService.getPortfolio(userId, page, limit));
    }

    @GetMapping("/api/users/{userId}/portfolio/{pieceId}")
    public ResponseEntity<ArtPieceResponseDTO> getArtwork(
            @PathVariable UUID userId,
            @PathVariable UUID pieceId,
            @RequestParam(required = false) Integer width,
            @RequestParam(required = false) Integer height) {
        return ResponseEntity.ok(portfolioService.getArtwork(pieceId, width, height));
    }

    @GetMapping("/api/portfolio/{pieceId}")
    public ResponseEntity<ArtPieceResponseDTO> getArtworkById(
            @PathVariable UUID pieceId,
            @RequestParam(required = false) Integer width,
            @RequestParam(required = false) Integer height) {
        return ResponseEntity.ok(portfolioService.getArtworkById(pieceId, width, height));
    }

    @GetMapping("/api/users/me/portfolio")
    public ResponseEntity<PaginatedResponse<ArtPieceResponseDTO>> getMyPortfolio(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {
        return ResponseEntity.ok(portfolioService.getMyPortfolio(page, limit));
    }

    @GetMapping("/api/users/me/portfolio/{pieceId}")
    public ResponseEntity<ArtPieceResponseDTO> getMyArtwork(
            @PathVariable UUID pieceId,
            @RequestParam(required = false) Integer width,
            @RequestParam(required = false) Integer height) {
        return ResponseEntity.ok(portfolioService.getMyArtwork(pieceId, width, height));
    }

    @PostMapping("/api/users/me/portfolio")
    public ResponseEntity<ArtPieceResponseDTO> createPiece(@RequestBody ArtPieceCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(portfolioService.createPiece(request));
    }

    @PostMapping("/api/users/me/portfolio/{pieceId}/reorder-assets")
    public ResponseEntity<SimpleMessageResponseDTO> reorderAssets(
            @PathVariable UUID pieceId,
            @RequestBody List<UUID> assetIds) {
        return ResponseEntity.ok(portfolioService.reorderAssets(pieceId, assetIds));
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
