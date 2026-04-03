package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import server.art.data.dto.storage.*;
import server.art.data.dto.common.*;
import server.art.exceptions.BusinessLogicException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StorageService {

    private final IdentityService identityService;
    private static final String STUB_BASE_URL = "http://127.0.0.1:10000/devstoreaccount1";

    public SasTokenResponseDTO generateSasToken(SasTokenRequestDTO request) {
        String fileName = request.getFileName();
        if (fileName == null || fileName.isBlank()) {
            throw new BusinessLogicException("File name is required");
        }

        String userId = identityService.getCurrentUserSub();
        String timestamp = String.valueOf(System.currentTimeMillis());
        String blobPath = request.getContainer() + "/" + userId + "/" + timestamp + "-" + fileName;

        // Stub: In production, generate real SAS token using Azure SDK
        String sasUrl = STUB_BASE_URL + "/" + blobPath + "?sv=2021-06-08&sig=stub-signature";

        return SasTokenResponseDTO.builder()
                .sasUrl(sasUrl)
                .blobPath(blobPath)
                .sasToken("stub-token")
                .build();
    }

    public SimpleMessageResponseDTO completeUpload(CompleteUploadRequestDTO request) {
        // Implementation logic
        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Upload completed for " + request.getBlobPath())
                .build();
    }

    public DownloadUrlResponseDTO generateDownloadUrl(UUID assetId) {
        String downloadUrl = STUB_BASE_URL + "/asset/" + assetId + "?sv=2021-06-08&sig=stub-read-signature";
        return DownloadUrlResponseDTO.builder()
                .downloadUrl(downloadUrl)
                .build();
    }

    public SimpleMessageResponseDTO deleteBlob(String blobPath) {
        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("File " + blobPath + " deleted")
                .build();
    }
}
