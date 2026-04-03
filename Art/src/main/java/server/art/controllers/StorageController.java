package server.art.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.storage.*;
import server.art.data.dto.common.*;
import server.art.services.StorageService;

import java.util.UUID;

@RestController
@RequestMapping("/api/storage")
@RequiredArgsConstructor
public class StorageController {

    private final StorageService storageService;

    @PostMapping("/sas-token")
    public ResponseEntity<SasTokenResponseDTO> generateSasToken(@RequestBody SasTokenRequestDTO request) {
        return ResponseEntity.ok(storageService.generateSasToken(request));
    }

    @PostMapping("/complete-upload")
    public ResponseEntity<SimpleMessageResponseDTO> completeUpload(@RequestBody CompleteUploadRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(storageService.completeUpload(request));
    }

    @GetMapping("/download/{assetId}")
    public ResponseEntity<DownloadUrlResponseDTO> getDownloadUrl(@PathVariable UUID assetId) {
        return ResponseEntity.ok(storageService.generateDownloadUrl(assetId));
    }

    @DeleteMapping("/{*blobPath}")
    public ResponseEntity<SimpleMessageResponseDTO> deleteBlob(@PathVariable String blobPath) {
        return ResponseEntity.ok(storageService.deleteBlob(blobPath));
    }
}
