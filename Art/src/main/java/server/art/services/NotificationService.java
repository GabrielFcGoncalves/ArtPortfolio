package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.Notification;
import server.art.data.User;
import server.art.data.enums.NotificationType;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.NotificationRepository;
import server.art.repositories.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    public PaginatedResponse<Map<String, Object>> getNotifications(int page, int limit, boolean unreadOnly) {
        User user = getCurrentUser();
        PageRequest pageRequest = PageRequest.of(page - 1, limit);

        Page<Notification> notifPage;
        if (unreadOnly) {
            notifPage = notificationRepository
                    .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId(), pageRequest);
        } else {
            notifPage = notificationRepository
                    .findByUserIdOrderByCreatedAtDesc(user.getId(), pageRequest);
        }

        long unreadCount = notificationRepository.countByUserIdAndIsReadFalse(user.getId());

        List<Map<String, Object>> data = notifPage.getContent().stream()
                .map(this::mapNotification)
                .toList();

        PaginatedResponse<Map<String, Object>> response = PaginatedResponse.of(
                data, notifPage.getTotalElements(), page, limit);

        return response;
    }

    public long getUnreadCount() {
        User user = getCurrentUser();
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public Map<String, Object> markAsRead(UUID notificationId) {
        User user = getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notification.getUserId().equals(user.getId())) {
            throw new BusinessLogicException("You do not own this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);

        return Map.of("success", true);
    }

    @Transactional
    public Map<String, Object> markAllAsRead() {
        User user = getCurrentUser();
        int count = notificationRepository.markAllAsRead(user.getId());
        return Map.of("success", true, "updated", count);
    }

    /**
     * Create a notification. Called internally by other services.
     */
    public void createNotification(UUID userId, NotificationType type, String title, String message,
                                   UUID relatedCommissionId, UUID relatedUserId) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .relatedCommissionId(relatedCommissionId)
                .relatedUserId(relatedUserId)
                .build();
        notificationRepository.save(notification);
    }

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private Map<String, Object> mapNotification(Notification n) {
        Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", n.getId());
        map.put("type", n.getType().name());
        map.put("title", n.getTitle());
        map.put("message", n.getMessage() != null ? n.getMessage() : "");
        map.put("is_read", n.isRead());
        map.put("created_at", n.getCreatedAt().toString());
        if (n.getRelatedCommissionId() != null) {
            map.put("related_commission_id", n.getRelatedCommissionId());
        }
        if (n.getRelatedUserId() != null) {
            map.put("related_user_id", n.getRelatedUserId());
        }
        return map;
    }
}
