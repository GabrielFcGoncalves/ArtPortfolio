package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import server.art.exceptions.BusinessLogicException;

import java.util.Map;
import java.util.UUID;

/**
 * Storage service for Azure Blob Storage (Azurite in dev).
 * TODO: Integrate real Azure Storage SDK when connection strings are configured.
 * Currently returns stub URLs for local development.
 */
@Service
@RequiredArgsConstructor
public class StorageService {

    private final IdentityService identityService;

    private static final String STUB_BASE_URL = "http://127.0.0.1:10000/devstoreaccount1";

    public Map<String, Object> generateSasToken(String fileName, String fileType, String container) {
        if (fileName == null || fileName.isBlank()) {
            throw new BusinessLogicException("File name is required");
        }

        String userId = identityService.getCurrentUserSub();
        String timestamp = String.valueOf(System.currentTimeMillis());
        String blobPath = container + "/" + userId + "/" + timestamp + "-" + fileName;

        // Stub: In production, generate real SAS token using Azure SDK
        String sasUrl = STUB_BASE_URL + "/" + blobPath + "?sv=2021-06-08&sig=stub-signature";

        return Map.of(
                "sas_url", sasUrl,
                "blob_path", blobPath,
                "expires_in", 900
        );
    }

    public Map<String, Object> completeUpload(String blobPath, UUID milestoneId, long fileSizeBytes, String fileType) {
        // Stub: verify blob exists in storage, create asset record
        String blobUrl = STUB_BASE_URL + "/" + blobPath;

        return Map.of(
                "asset", Map.of(
                        "blob_path", blobPath,
                        "blob_url", blobUrl,
                        "file_size_bytes", fileSizeBytes,
                        "file_type", fileType,
                        "is_final_version", false
                )
        );
    }

    public Map<String, Object> generateDownloadUrl(UUID assetId) {
        // Stub: generate read-only SAS token
        String downloadUrl = STUB_BASE_URL + "/asset/" + assetId + "?sv=2021-06-08&sig=stub-read-signature";
        return Map.of("download_url", downloadUrl);
    }

    public Map<String, Object> deleteBlob(String blobPath) {
        // Stub: delete from storage
        return Map.of("success", true, "message", "File deleted");
    }
}
