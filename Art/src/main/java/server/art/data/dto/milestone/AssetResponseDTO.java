package server.art.data.dto.milestone;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class AssetResponseDTO {
    private UUID id;
    
    @JsonProperty("blob_url")
    private String blobUrl;
    
    @JsonProperty("is_final_version")
    private boolean isFinalVersion;
}
