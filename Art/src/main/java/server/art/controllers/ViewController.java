package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.common.SimpleMessageResponseDTO;
import server.art.services.ViewService;
import java.util.UUID;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class ViewController {

    private final ViewService viewService;

    @PostMapping("/{pieceId}/view")
    public ResponseEntity<SimpleMessageResponseDTO> recordView(@PathVariable UUID pieceId) {
        return ResponseEntity.ok(viewService.recordView(pieceId));
    }
}
