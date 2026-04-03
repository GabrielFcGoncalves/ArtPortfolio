package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.art.dto.PaginatedResponse;
import server.art.services.MessageService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/commissions/{commissionId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMessage(
            @PathVariable UUID commissionId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(messageService.sendMessage(commissionId, body.get("content")));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<Map<String, Object>>> getMessages(
            @PathVariable UUID commissionId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(messageService.getMessages(commissionId, page, limit));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Map<String, Object>> deleteMessage(
            @PathVariable UUID commissionId,
            @PathVariable String messageId) {
        return ResponseEntity.ok(messageService.deleteMessage(commissionId, messageId));
    }
}
