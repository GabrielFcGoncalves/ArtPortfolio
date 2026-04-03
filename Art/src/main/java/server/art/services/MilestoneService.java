package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.*;
import server.art.data.dto.milestone.*;
import server.art.data.dto.portfolio.*;
import server.art.data.enums.CommissionStatus;
import server.art.data.enums.MilestoneStatus;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.*;

import java.time.Instant;
import java.util.List;
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

    public List<MilestoneResponseDTO> getMilestones(UUID commissionId) {
        List<Milestone> milestones = milestoneRepository.findByCommissionIdOrderBySequenceOrderAsc(commissionId);
        return milestones.stream()
                .map(m -> {
                    List<Asset> assets = assetRepository.findByMilestoneIdAndIsDeletedFalse(m.getId());
                    List<AssetResponseDTO> assetDTOs = assets.stream()
                            .map(a -> AssetResponseDTO.builder()
                                    .id(a.getId())
                                    .blobUrl(a.getBlobUrl())
                                    .isFinalVersion(a.isFinalVersion())
                                    .build())
                            .toList();

                    return MilestoneResponseDTO.builder()
                            .id(m.getId())
                            .title(m.getName())
                            .status(m.getStatus().name())
                            .order_index(m.getSequenceOrder())
                            .assets(assetDTOs.stream().map(a -> ArtPieceAssetResponseDTO.builder()
                                    .id(a.getId())
                                    .blobUrl(a.getBlobUrl())
                                    .build()).toList()) // Mapping between Asset and ArtPieceAsset for compatibility? Let's check
                            .build();
                })
                .toList();
    }

    @Transactional
    public MilestoneResponseDTO submitMilestone(UUID commissionId, UUID milestoneId, String message) {
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
        Milestone saved = milestoneRepository.save(milestone);

        return mapToDTO(saved);
    }

    @Transactional
    public MilestoneResponseDTO approveMilestone(UUID commissionId, UUID milestoneId) {
        User user = getCurrentUser();
        Commission commission = getCommissionAsClient(commissionId, user);
        Milestone milestone = getMilestoneInCommission(milestoneId, commissionId);

        if (milestone.getStatus() != MilestoneStatus.SUBMITTED) {
            throw new BusinessLogicException("Milestone must be submitted before approval");
        }

        milestone.setStatus(MilestoneStatus.APPROVED);
        milestone.setApprovedAt(Instant.now());
        milestoneRepository.save(milestone);

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

        if (allMilestones.stream().allMatch(m -> m.getStatus() == MilestoneStatus.APPROVED)) {
            commission.setStatus(CommissionStatus.REVIEW);
        }

        commissionRepository.save(commission);
        return mapToDTO(milestone);
    }

    @Transactional
    public RevisionRequestResponseDTO requestRevision(UUID commissionId, UUID milestoneId, String feedback, String reason) {
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
        RevisionRequest saved = revisionRequestRepository.save(revisionRequest);

        milestone.setStatus(MilestoneStatus.REVISION_REQUESTED);
        milestoneRepository.save(milestone);

        commission.setRevisionsUsed(commission.getRevisionsUsed() + 1);
        commissionRepository.save(commission);

        return RevisionRequestResponseDTO.builder()
                .id(saved.getId())
                .milestoneId(milestoneId)
                .feedback(feedback)
                .status(saved.getStatus())
                .createdAt(saved.getCreatedAt().toString())
                .build();
    }

    @Transactional
    public AssetResponseDTO updateAsset(UUID commissionId, UUID milestoneId, UUID assetId, boolean isFinalVersion) {
        User user = getCurrentUser();
        getCommissionAsArtist(commissionId, user);

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found: " + assetId));

        if (!asset.getMilestone().getId().equals(milestoneId)) {
            throw new BusinessLogicException("Asset does not belong to this milestone");
        }

        asset.setFinalVersion(isFinalVersion);
        Asset saved = assetRepository.save(asset);

        return AssetResponseDTO.builder()
                .id(saved.getId())
                .blobUrl(saved.getBlobUrl())
                .isFinalVersion(saved.isFinalVersion())
                .build();
    }

    private MilestoneResponseDTO mapToDTO(Milestone m) {
        return MilestoneResponseDTO.builder()
                .id(m.getId())
                .title(m.getName())
                .description(m.getDescription())
                .status(m.getStatus().name())
                .order_index(m.getSequenceOrder())
                .build();
    }

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
