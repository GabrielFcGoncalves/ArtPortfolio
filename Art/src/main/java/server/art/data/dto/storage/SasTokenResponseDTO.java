package server.art.data.dto.storage;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SasTokenResponseDTO {
    @JsonProperty("sas_token")
    private String sasToken;
    
    @JsonProperty("sas_url")
    private String sasUrl;
    
    @JsonProperty("blob_path")
    private String blobPath;
}
