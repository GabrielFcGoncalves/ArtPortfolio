package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.Notification;
import server.art.data.User;
import server.art.data.dto.notification.*;
import server.art.data.dto.common.*;
import server.art.data.enums.NotificationType;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.NotificationRepository;
import server.art.repositories.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    public PaginatedResponse<NotificationResponseDTO> getNotifications(int page, int limit, boolean unreadOnly) {
        User user = getCurrentUser();
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

        Page<Notification> notifPage;
        if (unreadOnly) {
            notifPage = notificationRepository
                    .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId(), pageRequest);
        } else {
            notifPage = notificationRepository
                    .findByUserIdOrderByCreatedAtDesc(user.getId(), pageRequest);
        }

        List<NotificationResponseDTO> data = notifPage.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        return PaginatedResponse.of(data, notifPage.getTotalElements(), page, limit);
    }

    public long getUnreadCount() {
        User user = getCurrentUser();
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public NotificationResponseDTO markAsRead(UUID notificationId) {
        User user = getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notification.getUserId().equals(user.getId())) {
            throw new BusinessLogicException("You do not own this notification");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);

        return mapToDTO(saved);
    }

    @Transactional
    public SimpleMessageResponseDTO markAllAsRead() {
        User user = getCurrentUser();
        int count = notificationRepository.markAllAsRead(user.getId());
        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Marked " + count + " notifications as read")
                .build();
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

    private NotificationResponseDTO mapToDTO(Notification n) {
        return NotificationResponseDTO.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .relatedCommissionId(n.getRelatedCommissionId())
                .relatedUserId(n.getRelatedUserId())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt().toString())
                .build();
    }
}
