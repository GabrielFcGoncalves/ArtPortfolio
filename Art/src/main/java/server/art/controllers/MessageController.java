package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.message.*;
import server.art.data.dto.common.*;
import server.art.dto.PaginatedResponse;
import server.art.services.MessageService;

import java.util.UUID;

@RestController
@RequestMapping("/api/commissions/{commissionId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @PathVariable UUID commissionId,
            @RequestBody MessageCreateRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.sendMessage(commissionId, request));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<MessageResponseDTO>> getMessages(
            @PathVariable UUID commissionId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(messageService.getMessages(commissionId, page, limit));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<SimpleMessageResponseDTO> deleteMessage(
            @PathVariable UUID commissionId,
            @PathVariable String messageId) {
        return ResponseEntity.ok(messageService.deleteMessage(commissionId, messageId));
    }
}
