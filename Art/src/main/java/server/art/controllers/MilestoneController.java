package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import server.art.services.MilestoneService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/commissions/{commissionId}/milestones")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMilestones(@PathVariable UUID commissionId) {
        List<Map<String, Object>> milestones = milestoneService.getMilestones(commissionId);
        return ResponseEntity.ok(Map.of("milestones", milestones));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Map<String, Object>> submitMilestone(
            @PathVariable UUID commissionId,
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> body) {
        String message = body != null ? body.get("message") : null;
        return ResponseEntity.ok(milestoneService.submitMilestone(commissionId, id, message));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Map<String, Object>> approveMilestone(
            @PathVariable UUID commissionId,
            @PathVariable UUID id) {
        return ResponseEntity.ok(milestoneService.approveMilestone(commissionId, id));
    }

    @PostMapping("/{id}/request-revision")
    public ResponseEntity<Map<String, Object>> requestRevision(
            @PathVariable UUID commissionId,
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(milestoneService.requestRevision(commissionId, id,
                        body.get("feedback"), body.get("revision_reason")));
    }

    @PatchMapping("/{id}/assets/{assetId}")
    public ResponseEntity<Map<String, Object>> updateAsset(
            @PathVariable UUID commissionId,
            @PathVariable UUID id,
            @PathVariable UUID assetId,
            @RequestBody Map<String, Object> body) {
        boolean isFinalVersion = (Boolean) body.get("is_final_version");
        return ResponseEntity.ok(milestoneService.updateAsset(commissionId, id, assetId, isFinalVersion));
    }
}
