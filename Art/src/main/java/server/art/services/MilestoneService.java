package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.Asset;
import server.art.data.Commission;
import server.art.data.Milestone;
import server.art.data.RevisionRequest;
import server.art.data.User;
import server.art.data.enums.CommissionStatus;
import server.art.data.enums.MilestoneStatus;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.AssetRepository;
import server.art.repositories.CommissionRepository;
import server.art.repositories.MilestoneRepository;
import server.art.repositories.RevisionRequestRepository;
import server.art.repositories.UserRepository;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final CommissionRepository commissionRepository;
    private final AssetRepository assetRepository;
    private final RevisionRequestRepository revisionRequestRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    public List<Map<String, Object>> getMilestones(UUID commissionId) {
        List<Milestone> milestones = milestoneRepository.findByCommissionIdOrderBySequenceOrderAsc(commissionId);
        return milestones.stream()
                .map(m -> {
                    List<Asset> assets = assetRepository.findByMilestoneIdAndIsDeletedFalse(m.getId());
                    List<Map<String, Object>> assetMaps = assets.stream()
                            .map(a -> Map.<String, Object>of(
                                    "id", a.getId(),
                                    "blob_url", a.getBlobUrl(),
                                    "is_final_version", a.isFinalVersion()
                            ))
                            .toList();

                    return Map.<String, Object>of(
                            "id", m.getId(),
                            "name", m.getName(),
                            "status", m.getStatus().name(),
                            "sequence_order", m.getSequenceOrder(),
                            "assets", assetMaps
                    );
                })
                .toList();
    }

    @Transactional
    public Map<String, Object> submitMilestone(UUID commissionId, UUID milestoneId, String message) {
        User user = getCurrentUser();
        Commission commission = getCommissionAsArtist(commissionId, user);
        Milestone milestone = getMilestoneInCommission(milestoneId, commissionId);

        if (milestone.getStatus() != MilestoneStatus.PENDING
                && milestone.getStatus() != MilestoneStatus.REVISION_REQUESTED) {
            throw new BusinessLogicException("Milestone is not in a submittable state");
        }

        long assetCount = assetRepository.countByMilestoneIdAndIsDeletedFalse(milestoneId);
        if (assetCount == 0) {
            throw new BusinessLogicException("Cannot submit milestone without any assets");
        }

        milestone.setStatus(MilestoneStatus.SUBMITTED);
        milestone.setSubmittedAt(Instant.now());
        milestoneRepository.save(milestone);

        return Map.of(
                "success", true,
                "milestone", Map.of(
                        "id", milestone.getId(),
                        "status", milestone.getStatus().name(),
                        "submitted_at", milestone.getSubmittedAt().toString()
                )
        );
    }

    @Transactional
    public Map<String, Object> approveMilestone(UUID commissionId, UUID milestoneId) {
        User user = getCurrentUser();
        Commission commission = getCommissionAsClient(commissionId, user);
        Milestone milestone = getMilestoneInCommission(milestoneId, commissionId);

        if (milestone.getStatus() != MilestoneStatus.SUBMITTED) {
            throw new BusinessLogicException("Milestone must be submitted before approval");
        }

        milestone.setStatus(MilestoneStatus.APPROVED);
        milestone.setApprovedAt(Instant.now());
        milestoneRepository.save(milestone);

        // Find next milestone
        List<Milestone> allMilestones = milestoneRepository.findByCommissionIdOrderBySequenceOrderAsc(commissionId);
        Milestone nextMilestone = null;
        boolean foundCurrent = false;
        for (Milestone m : allMilestones) {
            if (foundCurrent) {
                nextMilestone = m;
                break;
            }
            if (m.getId().equals(milestoneId)) {
                foundCurrent = true;
            }
        }

        if (nextMilestone != null) {
            commission.setCurrentMilestoneId(nextMilestone.getId());
        }

        // Check if all milestones are approved
        boolean allApproved = allMilestones.stream()
                .allMatch(m -> m.getStatus() == MilestoneStatus.APPROVED);

        if (allApproved) {
            commission.setStatus(CommissionStatus.REVIEW);
        }

        commissionRepository.save(commission);

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("success", true);
        result.put("milestone", Map.of(
                "id", milestone.getId(),
                "status", milestone.getStatus().name(),
                "approved_at", milestone.getApprovedAt().toString()
        ));
        if (nextMilestone != null) {
            result.put("next_milestone", Map.of("id", nextMilestone.getId(), "name", nextMilestone.getName()));
        }
        return result;
    }

    @Transactional
    public Map<String, Object> requestRevision(UUID commissionId, UUID milestoneId, String feedback, String reason) {
        User user = getCurrentUser();
        Commission commission = getCommissionAsClient(commissionId, user);
        Milestone milestone = getMilestoneInCommission(milestoneId, commissionId);

        if (milestone.getStatus() != MilestoneStatus.SUBMITTED) {
            throw new BusinessLogicException("Can only request revision on submitted milestones");
        }

        if (commission.getRevisionsUsed() >= commission.getRevisionLimit()) {
            throw new BusinessLogicException("Revision limit reached (" + commission.getRevisionLimit() + ")");
        }

        RevisionRequest revisionRequest = RevisionRequest.builder()
                .milestone(milestone)
                .feedback(feedback)
                .revisionReason(reason)
                .build();
        revisionRequestRepository.save(revisionRequest);

        milestone.setStatus(MilestoneStatus.REVISION_REQUESTED);
        milestoneRepository.save(milestone);

        commission.setRevisionsUsed(commission.getRevisionsUsed() + 1);
        commissionRepository.save(commission);

        return Map.of(
                "revision_request", Map.of(
                        "id", revisionRequest.getId(),
                        "milestone_id", milestoneId,
                        "feedback", feedback,
                        "status", revisionRequest.getStatus(),
                        "created_at", revisionRequest.getCreatedAt().toString()
                )
        );
    }

    @Transactional
    public Map<String, Object> updateAsset(UUID commissionId, UUID milestoneId, UUID assetId, boolean isFinalVersion) {
        User user = getCurrentUser();
        getCommissionAsArtist(commissionId, user);

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + assetId));

        if (!asset.getMilestone().getId().equals(milestoneId)) {
            throw new BusinessLogicException("Asset does not belong to this milestone");
        }

        asset.setFinalVersion(isFinalVersion);
        assetRepository.save(asset);

        return Map.of("success", true, "asset", Map.of("id", asset.getId(), "is_final_version", asset.isFinalVersion()));
    }

    // --- Helpers ---

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    private Commission getCommissionAsArtist(UUID commissionId, User user) {
        Commission commission = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));
        if (!commission.getArtist().getId().equals(user.getId())) {
            throw new BusinessLogicException("Only the commission artist can perform this action");
        }
        return commission;
    }

    private Commission getCommissionAsClient(UUID commissionId, User user) {
        Commission commission = commissionRepository.findById(commissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Commission not found: " + commissionId));
        if (!commission.getClient().getId().equals(user.getId())) {
            throw new BusinessLogicException("Only the commission client can perform this action");
        }
        return commission;
    }

    private Milestone getMilestoneInCommission(UUID milestoneId, UUID commissionId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found: " + milestoneId));
        if (!milestone.getCommission().getId().equals(commissionId)) {
            throw new BusinessLogicException("Milestone does not belong to this commission");
        }
        return milestone;
    }
}
