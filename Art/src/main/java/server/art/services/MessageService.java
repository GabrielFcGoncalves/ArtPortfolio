package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import server.art.data.Commission;
import server.art.data.Message;
import server.art.data.User;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.CommissionRepository;
import server.art.repositories.MessageRepository;
import server.art.repositories.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    public Map<String, Object> sendMessage(UUID commissionId, String content) {
        User user = getCurrentUser();
        verifyParticipant(commissionId, user);

        if (content == null || content.isBlank()) {
            throw new BusinessLogicException("Message content cannot be empty");
        }

        Message message = Message.builder()
                .commissionId(commissionId)
                .senderId(user.getId())
                .senderUsername(user.getUsername())
                .senderAvatarUrl(user.getAvatarUrl())
                .content(content)
                .build();

        Message saved = messageRepository.save(message);

        return Map.of("message", mapMessage(saved));
    }

    public PaginatedResponse<Map<String, Object>> getMessages(UUID commissionId, int page, int limit) {
        User user = getCurrentUser();
        verifyParticipant(commissionId, user);

        PageRequest pageRequest = PageRequest.of(page - 1, limit);
        Page<Message> messagesPage = messageRepository.findByCommissionIdOrderByCreatedAtDesc(commissionId, pageRequest);

        List<Map<String, Object>> data = messagesPage.getContent().stream()
                .map(this::mapMessage)
                .toList();

        return PaginatedResponse.of(data, messagesPage.getTotalElements(), page, limit);
    }

    public Map<String, Object> deleteMessage(UUID commissionId, String messageId) {
        User user = getCurrentUser();

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + messageId));

        if (!message.getSenderId().equals(user.getId())) {
            throw new BusinessLogicException("You can only delete your own messages");
        }

        message.setDeleted(true);
        messageRepository.save(message);

        return Map.of("success", true, "message", "Message deleted");
    }

    // --- Helpers ---

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private void verifyParticipant(UUID commissionId, User user) {
        Commission commission = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));
        if (!commission.getClient().getId().equals(user.getId())
                && !commission.getArtist().getId().equals(user.getId())) {
            throw new BusinessLogicException("You are not a participant in this commission");
        }
    }

    private Map<String, Object> mapMessage(Message m) {
        if (m.isDeleted()) {
            return Map.of(
                    "id", m.getId(),
                    "content", "[deleted]",
                    "created_at", m.getCreatedAt().toString()
            );
        }
        return Map.of(
                "id", m.getId(),
                "sender", Map.of(
                        "id", m.getSenderId(),
                        "username", m.getSenderUsername() != null ? m.getSenderUsername() : "",
                        "avatar_url", m.getSenderAvatarUrl() != null ? m.getSenderAvatarUrl() : ""
                ),
                "content", m.getContent(),
                "created_at", m.getCreatedAt().toString()
        );
    }
}
