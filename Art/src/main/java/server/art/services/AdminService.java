package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.Dispute;
import server.art.data.User;
import server.art.data.enums.CommissionStatus;
import server.art.data.enums.NotificationType;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.CommissionRepository;
import server.art.repositories.DisputeRepository;
import server.art.repositories.PaymentRepository;
import server.art.repositories.UserRepository;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CommissionRepository commissionRepository;
    private final PaymentRepository paymentRepository;
    private final DisputeRepository disputeRepository;
    private final NotificationService notificationService;
    private final IdentityService identityService;

    public Map<String, Object> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCommissions = commissionRepository.count();
        long completedCommissions = commissionRepository.countByStatus(CommissionStatus.COMPLETED);
        long activeDisputes = disputeRepository.countByStatus("OPEN");

        return Map.of("stats", Map.of(
                "total_users", totalUsers,
                "total_commissions", totalCommissions,
                "completed_commissions", completedCommissions,
                "active_disputes", activeDisputes
        ));
    }

    public PaginatedResponse<Map<String, Object>> listUsers(int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<User> usersPage = userRepository.findAll(pageRequest);

        List<Map<String, Object>> data = usersPage.getContent().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "email", u.getEmail(),
                        "username", u.getUsername(),
                        "role", u.getRole(),
                        "is_verified", u.isVerified(),
                        "is_active", u.isActive(),
                        "commission_count", u.getCommissionCount(),
                        "created_at", u.getCreatedAt().toString()
                ))
                .toList();

        return PaginatedResponse.of(data, usersPage.getTotalElements(), page, limit);
    }

    @Transactional
    public Map<String, Object> verifyArtist(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setVerified(true);
        userRepository.save(user);

        notificationService.createNotification(
                userId, NotificationType.ARTIST_VERIFIED,
                "Account Verified", "Your artist account has been verified",
                null, null
        );

        return Map.of("success", true, "message", "Artist verified");
    }

    @Transactional
    public Map<String, Object> suspendUser(UUID userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setActive(false);
        userRepository.save(user);

        notificationService.createNotification(
                userId, NotificationType.ACCOUNT_SUSPENDED,
                "Account Suspended", "Your account has been suspended: " + reason,
                null, null
        );

        return Map.of("success", true);
    }

    public PaginatedResponse<Map<String, Object>> listDisputes(int page, int limit, String status) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Dispute> disputesPage;

        if ("all".equalsIgnoreCase(status)) {
            disputesPage = disputeRepository.findAll(pageRequest);
        } else {
            disputesPage = disputeRepository.findByStatus(status, pageRequest);
        }

        List<Map<String, Object>> data = disputesPage.getContent().stream()
                .map(d -> Map.<String, Object>of(
                        "id", d.getId(),
                        "commission_id", d.getCommission().getId(),
                        "initiated_by_id", d.getInitiatedById(),
                        "reason", d.getReason(),
                        "status", d.getStatus(),
                        "created_at", d.getCreatedAt().toString()
                ))
                .toList();

        return PaginatedResponse.of(data, disputesPage.getTotalElements(), page, limit);
    }

    @Transactional
    public Map<String, Object> resolveDispute(UUID disputeId, String resolution, String resolutionType) {
        String keycloakId = identityService.getCurrentUserSub();
        User admin = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found: " + disputeId));

        dispute.setStatus("RESOLVED");
        dispute.setResolution(resolution);
        dispute.setResolutionType(resolutionType);
        dispute.setResolvedById(admin.getId());
        dispute.setResolvedAt(Instant.now());
        disputeRepository.save(dispute);

        return Map.of("success", true);
    }
}
