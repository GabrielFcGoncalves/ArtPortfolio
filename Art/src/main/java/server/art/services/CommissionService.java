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
import server.art.data.enums.CommissionStatus;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.CommissionRepository;
import server.art.repositories.MilestoneRepository;
import server.art.repositories.UserRepository;
import server.art.repositories.BlockedUserRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRepository commissionRepository;
    private final MilestoneRepository milestoneRepository;
    private final UserRepository userRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final IdentityService identityService;

    @Transactional
    public Commission createCommission(UUID artistId, String title, String description,
                                       long totalPriceCents, boolean isPhysical,
                                       int revisionLimit, String dueDate) {
        String keycloakId = identityService.getCurrentUserSub();
        User client = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User artist = userRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found: " + artistId));

        if (client.getId().equals(artistId)) {
            throw new BusinessLogicException("Cannot commission yourself");
        }

        if (blockedUserRepository.existsByBlockerIdAndBlockedId(artistId, client.getId())) {
            throw new BusinessLogicException("Cannot create commission: you are blocked by this artist");
        }

        Commission commission = Commission.builder()
                .client(client)
                .artist(artist)
                .title(title)
                .description(description)
                .totalPriceCents(totalPriceCents)
                .isPhysical(isPhysical)
                .revisionLimit(revisionLimit > 0 ? revisionLimit : 3)
                .build();

        if (dueDate != null) {
            commission.setDueDate(java.time.Instant.parse(dueDate));
        }

        Commission saved = commissionRepository.save(commission);

        // Generate default milestones
        createDefaultMilestones(saved);

        // Update artist commission count
        artist.setCommissionCount(artist.getCommissionCount() + 1);
        userRepository.save(artist);

        return saved;
    }

    private void createDefaultMilestones(Commission commission) {
        String[] defaultNames = {"Sketch", "Lineart", "Final"};
        for (int i = 0; i < defaultNames.length; i++) {
            Milestone milestone = Milestone.builder()
                    .commission(commission)
                    .name(defaultNames[i])
                    .sequenceOrder(i + 1)
                    .build();
            Milestone saved = milestoneRepository.save(milestone);
            if (i == 0) {
                commission.setCurrentMilestoneId(saved.getId());
                commissionRepository.save(commission);
            }
        }
    }

    public PaginatedResponse<Map<String, Object>> listCommissions(String role, String status, int page, int limit) {
        String keycloakId = identityService.getCurrentUserSub();
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Commission> commissionsPage;

        if ("artist".equalsIgnoreCase(role)) {
            commissionsPage = commissionRepository.findByArtistId(user.getId(), pageRequest);
        } else if ("client".equalsIgnoreCase(role)) {
            commissionsPage = commissionRepository.findByClientId(user.getId(), pageRequest);
        } else {
            commissionsPage = commissionRepository.findByClientIdOrArtistId(user.getId(), user.getId(), pageRequest);
        }

        List<Map<String, Object>> data = commissionsPage.getContent().stream()
                .map(this::mapCommissionToSummary)
                .toList();

        return PaginatedResponse.of(data, commissionsPage.getTotalElements(), page, limit);
    }

    public Map<String, Object> getCommissionDetail(UUID commissionId) {
        String keycloakId = identityService.getCurrentUserSub();
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        Commission commission = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));

        if (!commission.getClient().getId().equals(user.getId())
                && !commission.getArtist().getId().equals(user.getId())) {
            throw new BusinessLogicException("You are not a participant in this commission");
        }

        List<Milestone> milestones = milestoneRepository.findByCommissionIdOrderBySequenceOrderAsc(commissionId);

        return Map.of(
                "commission", mapCommissionToDetail(commission, milestones)
        );
    }

    @Transactional
    public Commission updateCommission(UUID commissionId, String title, String description, Integer revisionLimit) {
        String keycloakId = identityService.getCurrentUserSub();
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        Commission commission = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));

        if (!commission.getClient().getId().equals(user.getId())
                && !commission.getArtist().getId().equals(user.getId())) {
            throw new BusinessLogicException("You are not a participant in this commission");
        }

        if (title != null) commission.setTitle(title);
        if (description != null) commission.setDescription(description);
        if (revisionLimit != null) commission.setRevisionLimit(revisionLimit);

        return commissionRepository.save(commission);
    }

    @Transactional
    public void cancelCommission(UUID commissionId, String reason) {
        String keycloakId = identityService.getCurrentUserSub();
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        Commission commission = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));

        if (!commission.getClient().getId().equals(user.getId())
                && !commission.getArtist().getId().equals(user.getId())) {
            throw new BusinessLogicException("You are not a participant in this commission");
        }

        if (commission.getStatus() == CommissionStatus.COMPLETED
                || commission.getStatus() == CommissionStatus.CANCELLED) {
            throw new BusinessLogicException("Commission cannot be cancelled in its current state");
        }

        commission.setStatus(CommissionStatus.CANCELLED);
        commissionRepository.save(commission);
    }

    // --- Mappers ---

    private Map<String, Object> mapCommissionToSummary(Commission c) {
        return Map.of(
                "id", c.getId(),
                "title", c.getTitle(),
                "artist", Map.of("id", c.getArtist().getId(), "username", c.getArtist().getUsername()),
                "client", Map.of("id", c.getClient().getId(), "username", c.getClient().getUsername()),
                "total_price_cents", c.getTotalPriceCents(),
                "status", c.getStatus().name(),
                "created_at", c.getCreatedAt().toString()
        );
    }

    private Map<String, Object> mapCommissionToDetail(Commission c, List<Milestone> milestones) {
        List<Map<String, Object>> milestoneMaps = milestones.stream()
                .map(m -> Map.<String, Object>of(
                        "id", m.getId(),
                        "name", m.getName(),
                        "status", m.getStatus().name(),
                        "sequence_order", m.getSequenceOrder()
                ))
                .toList();

        return Map.ofEntries(
                Map.entry("id", c.getId()),
                Map.entry("title", c.getTitle()),
                Map.entry("description", c.getDescription() != null ? c.getDescription() : ""),
                Map.entry("artist", Map.of("id", c.getArtist().getId(), "username", c.getArtist().getUsername())),
                Map.entry("client", Map.of("id", c.getClient().getId(), "username", c.getClient().getUsername())),
                Map.entry("total_price_cents", c.getTotalPriceCents()),
                Map.entry("status", c.getStatus().name()),
                Map.entry("escrow_status", c.getEscrowStatus().name()),
                Map.entry("revision_limit", c.getRevisionLimit()),
                Map.entry("revisions_used", c.getRevisionsUsed()),
                Map.entry("milestones", milestoneMaps),
                Map.entry("created_at", c.getCreatedAt().toString())
        );
    }
}
