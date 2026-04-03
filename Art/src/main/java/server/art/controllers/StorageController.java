package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import server.art.services.StorageService;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {

    private final StorageService storageService;

    @PostMapping("/sas-token")
    public ResponseEntity<Map<String, Object>> generateSasToken(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(storageService.generateSasToken(
                body.get("file_name"),
                body.get("file_type"),
                body.get("container")
        ));
    }

    @PostMapping("/complete-upload")
    public ResponseEntity<Map<String, Object>> completeUpload(@RequestBody Map<String, Object> body) {
        String blobPath = (String) body.get("blob_path");
        UUID milestoneId = body.containsKey("milestone_id") ? UUID.fromString((String) body.get("milestone_id")) : null;
        long fileSizeBytes = ((Number) body.get("file_size_bytes")).longValue();
        String fileType = (String) body.get("file_type");

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(storageService.completeUpload(blobPath, milestoneId, fileSizeBytes, fileType));
    }

    @GetMapping("/download/{assetId}")
    public ResponseEntity<Map<String, Object>> getDownloadUrl(@org.springframework.web.bind.annotation.PathVariable UUID assetId) {
        return ResponseEntity.ok(storageService.generateDownloadUrl(assetId));
    }

    @DeleteMapping("/**")
    public ResponseEntity<Map<String, Object>> deleteBlob(jakarta.servlet.http.HttpServletRequest request) {
        String blobPath = request.getRequestURI().replace("/api/storage/", "");
        return ResponseEntity.ok(storageService.deleteBlob(blobPath));
    }
}
