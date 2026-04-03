package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.Commission;
import server.art.data.Milestone;
import server.art.data.User;
import server.art.data.dto.commission.*;
import server.art.data.dto.milestone.*;
import server.art.data.enums.CommissionStatus;
import server.art.data.enums.MilestoneStatus;
import server.art.data.enums.NotificationType;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.CommissionRepository;
import server.art.repositories.MilestoneRepository;
import server.art.repositories.UserRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRepository commissionRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;
    private final NotificationService notificationService;

    public PaginatedResponse<CommissionSummaryDTO> listCommissions(String role, String status, int page, int limit) {
        User user = getCurrentUser();
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());

        Page<Commission> commissionsPage;
        CommissionStatus s = (status != null && !status.equalsIgnoreCase("all")) ? 
            CommissionStatus.valueOf(status.toUpperCase()) : null;

        if ("ARTIST".equalsIgnoreCase(role)) {
            commissionsPage = (s != null) ? 
                commissionRepository.findByArtistIdAndStatus(user.getId(), s, pageRequest) : 
                commissionRepository.findByArtistId(user.getId(), pageRequest);
        } else if ("CLIENT".equalsIgnoreCase(role)) {
            commissionsPage = (s != null) ? 
                commissionRepository.findByClientIdAndStatus(user.getId(), s, pageRequest) : 
                commissionRepository.findByClientId(user.getId(), pageRequest);
        } else {
            commissionsPage = commissionRepository.findByClientIdOrArtistId(user.getId(), user.getId(), pageRequest);
        }

        List<CommissionSummaryDTO> data = commissionsPage.getContent().stream()
                .map(this::mapToSummaryDTO)
                .toList();

        return PaginatedResponse.of(data, commissionsPage.getTotalElements(), page, limit);
    }

    public CommissionDetailResponseDTO getCommissionDetail(UUID commissionId) {
        Commission c = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));
        
        List<Milestone> milestones = milestoneRepository.findByCommissionIdOrderBySequenceOrderAsc(commissionId);
        
        return mapToDetailDTO(c, milestones);
    }

    @Transactional
    public CommissionDetailResponseDTO createCommission(CommissionCreateRequestDTO request) {
        User client = getCurrentUser();
        User artist = userRepository.findById(request.getArtistId())
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found"));

        if (!artist.getRole().equalsIgnoreCase("ARTIST")) {
            throw new BusinessLogicException("Selected user is not an artist");
        }

        Commission commission = Commission.builder()
                .client(client)
                .artist(artist)
                .title(request.getTitle())
                .description(request.getDescription())
                .totalPriceCents(request.getTotalPriceCents())
                .isPhysical(request.isPhysical())
                .revisionLimit(request.getRevisionLimit())
                .status(CommissionStatus.REQUESTED)
                .build();

        Commission saved = commissionRepository.save(commission);

        // Create default milestone
        Milestone milestone = Milestone.builder()
                .commission(saved)
                .name("Final Delivery")
                .sequenceOrder(1)
                .status(MilestoneStatus.PENDING)
                .build();
        milestoneRepository.save(milestone);

        notificationService.createNotification(
                artist.getId(), NotificationType.COMMISSION_REQUESTED,
                "New Commission Request",
                "You have a new commission request for: " + request.getTitle(),
                saved.getId(), client.getId()
        );

        return mapToDetailDTO(saved, List.of(milestone));
    }

    @Transactional
    public CommissionDetailResponseDTO updateCommission(UUID id, CommissionUpdateRequestDTO request) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found"));

        if (request.getTitle() != null) commission.setTitle(request.getTitle());
        if (request.getDescription() != null) commission.setDescription(request.getDescription());
        if (request.getRevisionLimit() != null) commission.setRevisionLimit(request.getRevisionLimit());

        Commission saved = commissionRepository.save(commission);
        List<Milestone> milestones = milestoneRepository.findByCommissionIdOrderBySequenceOrderAsc(id);
        return mapToDetailDTO(saved, milestones);
    }

    @Transactional
    public void cancelCommission(UUID id, String reason) {
        Commission commission = commissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found"));
        
        commission.setStatus(CommissionStatus.CANCELLED);
        commissionRepository.save(commission);

        User currentUser = getCurrentUser();
        UUID targetUserId = currentUser.getId().equals(commission.getArtist().getId()) ? 
            commission.getClient().getId() : commission.getArtist().getId();

        notificationService.createNotification(
                targetUserId, NotificationType.COMMISSION_CANCELLED,
                "Commission Cancelled",
                "Commission '" + commission.getTitle() + "' has been cancelled: " + reason,
                id, currentUser.getId()
        );
    }

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private CommissionSummaryDTO mapToSummaryDTO(Commission c) {
        return CommissionSummaryDTO.builder()
                .id(c.getId())
                .title(c.getTitle())
                .status(c.getStatus().name())
                .clientUsername(c.getClient().getUsername())
                .artistUsername(c.getArtist().getUsername())
                .totalPriceCents(c.getTotalPriceCents())
                .createdAt(c.getCreatedAt().toString())
                .build();
    }

    private CommissionDetailResponseDTO mapToDetailDTO(Commission c, List<Milestone> milestones) {
        List<MilestoneResponseDTO> milestoneDTOs = milestones.stream()
                .map(m -> MilestoneResponseDTO.builder()
                        .id(m.getId())
                        .title(m.getName())
                        .description(m.getDescription())
                        .status(m.getStatus().name())
                        .order_index(m.getSequenceOrder())
                        .build())
                .toList();

        return CommissionDetailResponseDTO.builder()
                .id(c.getId().toString())
                .title(c.getTitle())
                .description(c.getDescription())
                .status(c.getStatus().name())
                .totalPriceCents(c.getTotalPriceCents())
                .clientUsername(c.getClient().getUsername())
                .artistUsername(c.getArtist().getUsername())
                .milestones(milestoneDTOs)
                .build();
    }
}
