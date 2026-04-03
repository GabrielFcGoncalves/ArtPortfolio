package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.art.data.dto.notification.NotificationResponseDTO;
import server.art.data.dto.common.SimpleMessageResponseDTO;
import server.art.dto.PaginatedResponse;
import server.art.services.NotificationService;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/api/users/me/notifications")
    public ResponseEntity<PaginatedResponse<NotificationResponseDTO>> getNotifications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        return ResponseEntity.ok(notificationService.getNotifications(page, limit, unreadOnly));
    }

    @PostMapping("/api/users/me/notifications/{notificationId}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable UUID notificationId) {
        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
    }

    @PostMapping("/api/users/me/notifications/read-all")
    public ResponseEntity<SimpleMessageResponseDTO> markAllAsRead() {
        return ResponseEntity.ok(notificationService.markAllAsRead());
    }
}
