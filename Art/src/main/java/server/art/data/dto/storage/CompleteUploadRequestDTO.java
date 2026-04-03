package server.art.data.dto.storage;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class CompleteUploadRequestDTO {
    @JsonProperty("blob_path")
    private String blobPath;
    
    @JsonProperty("milestone_id")
    private UUID milestoneId;
    
    @JsonProperty("file_size_bytes")
    private long fileSizeBytes;
    
    @JsonProperty("file_type")
    private String fileType;
}
