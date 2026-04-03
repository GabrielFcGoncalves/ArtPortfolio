package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.art.services.NotificationService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(name = "unread_only", defaultValue = "false") boolean unreadOnly) {
        return ResponseEntity.ok(notificationService.getNotifications(page, limit, unreadOnly));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable UUID id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllAsRead() {
        return ResponseEntity.ok(notificationService.markAllAsRead());
    }
}
