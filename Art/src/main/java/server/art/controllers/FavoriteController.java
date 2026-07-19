package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.social.FavoriteToggleResponseDTO;
import server.art.services.FavoriteService;
import java.util.UUID;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{pieceId}/favorite")
    public ResponseEntity<FavoriteToggleResponseDTO> toggleFavorite(@PathVariable UUID pieceId) {
        return ResponseEntity.ok(favoriteService.toggleFavorite(pieceId));
    }

    @GetMapping("/{pieceId}/favorite")
    public ResponseEntity<FavoriteToggleResponseDTO> getFavoriteStatus(@PathVariable UUID pieceId) {
        return ResponseEntity.ok(favoriteService.getFavoriteStatus(pieceId));
    }
}
