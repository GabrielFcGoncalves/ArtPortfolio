package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import server.art.data.Commission;
import server.art.data.Message;
import server.art.data.User;
import server.art.data.dto.message.*;
import server.art.data.dto.common.*;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.CommissionRepository;
import server.art.repositories.MessageRepository;
import server.art.repositories.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    public MessageResponseDTO sendMessage(UUID commissionId, MessageCreateRequestDTO request) {
        User user = getCurrentUser();
        verifyParticipant(commissionId, user);

        String content = request.getContent();
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

        return mapToDTO(saved);
    }

    public PaginatedResponse<MessageResponseDTO> getMessages(UUID commissionId, int page, int limit) {
        User user = getCurrentUser();
        verifyParticipant(commissionId, user);

        PageRequest pageRequest = PageRequest.of(page - 1, limit);
        Page<Message> messagesPage = messageRepository.findByCommissionIdOrderByCreatedAtDesc(commissionId, pageRequest);

        List<MessageResponseDTO> data = messagesPage.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        return PaginatedResponse.of(data, messagesPage.getTotalElements(), page, limit);
    }

    public SimpleMessageResponseDTO deleteMessage(UUID commissionId, String messageId) {
        User user = getCurrentUser();

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + messageId));

        if (!message.getSenderId().equals(user.getId())) {
            throw new BusinessLogicException("You can only delete your own messages");
        }

        message.setDeleted(true);
        messageRepository.save(message);

        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Message deleted")
                .build();
    }

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

    private MessageResponseDTO mapToDTO(Message m) {
        if (m.isDeleted()) {
            return MessageResponseDTO.builder()
                    .id(m.getId())
                    .content("[deleted]")
                    .createdAt(m.getCreatedAt().toString())
                    .build();
        }
        return MessageResponseDTO.builder()
                .id(m.getId())
                .sender(MessageSenderDTO.builder()
                        .id(m.getSenderId())
                        .username(m.getSenderUsername() != null ? m.getSenderUsername() : "")
                        .avatarUrl(m.getSenderAvatarUrl() != null ? m.getSenderAvatarUrl() : "")
                        .build())
                .content(m.getContent())
                .createdAt(m.getCreatedAt().toString())
                .build();
    }
}
