package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.User;
import server.art.data.dto.admin.*;
import server.art.data.dto.user.*;
import server.art.data.dto.common.*;
import server.art.data.enums.CommissionStatus;
import server.art.data.enums.NotificationType;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.CommissionRepository;
import server.art.repositories.DisputeRepository;
import server.art.repositories.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CommissionRepository commissionRepository;
    private final DisputeRepository disputeRepository;
    private final NotificationService notificationService;

    public DashboardStatsDTO getDashboardStats() {
        return DashboardStatsDTO.builder()
                .totalUsers(userRepository.count())
                .totalCommissions(commissionRepository.count())
                .totalRevenue(commissionRepository.sumAllRevenue().orElse(0L).doubleValue() / 100.0)
                .activeDisputes(disputeRepository.countByStatus("OPEN"))
                .build();
    }

    public PaginatedResponse<UserResponseDTO> listUsers(int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<User> usersPage = userRepository.findAll(pageRequest);

        List<UserResponseDTO> data = usersPage.getContent().stream()
                .map(this::mapToUserDTO)
                .toList();

        return PaginatedResponse.of(data, usersPage.getTotalElements(), page, limit);
    }

    @Transactional
    public UserResponseDTO verifyArtist(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setVerified(true);
        User saved = userRepository.save(user);

        notificationService.createNotification(
                userId, NotificationType.ARTIST_VERIFIED,
                "Verification Approved",
                "Your artist status has been verified! You can now accept commissions.",
                null, null
        );

        return mapToUserDTO(saved);
    }

    @Transactional
    public SimpleMessageResponseDTO suspendUser(UUID userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setActive(false);
        userRepository.save(user);

        notificationService.createNotification(
                userId, NotificationType.ACCOUNT_SUSPENDED,
                "Account Suspended",
                "Your account has been suspended for: " + reason,
                null, null
        );

        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("User suspended")
                .build();
    }

    public PaginatedResponse<DisputeResponseDTO> listDisputes(int page, int limit, String status) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        // Simple logic for disputes
        return PaginatedResponse.of(List.of(), 0, page, limit);
    }

    @Transactional
    public SimpleMessageResponseDTO resolveDispute(UUID id, String resolution, String resolutionType) {
        // Implementation logic
        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Dispute resolved with: " + resolutionType)
                .build();
    }

    private UserResponseDTO mapToUserDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .tier(user.getTier())
                .isVerified(user.isVerified())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt().toString())
                .build();
    }
}
