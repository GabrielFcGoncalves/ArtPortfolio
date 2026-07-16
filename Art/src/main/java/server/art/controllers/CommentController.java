package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.comment.CommentCreateRequestDTO;
import server.art.data.dto.comment.CommentResponseDTO;
import server.art.data.dto.common.SimpleMessageResponseDTO;
import server.art.dto.PaginatedResponse;
import server.art.services.CommentService;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/api/portfolio/{pieceId}/comments")
    public ResponseEntity<PaginatedResponse<CommentResponseDTO>> getComments(
            @PathVariable UUID pieceId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(commentService.getComments(pieceId, page, limit));
    }

    @PostMapping("/api/portfolio/{pieceId}/comments")
    public ResponseEntity<CommentResponseDTO> createComment(
            @PathVariable UUID pieceId,
            @RequestBody CommentCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.createComment(pieceId, request));
    }

    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<SimpleMessageResponseDTO> deleteComment(
            @PathVariable UUID commentId) {
        return ResponseEntity.ok(commentService.deleteComment(commentId));
    }
}
