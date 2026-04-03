package server.art.data.dto.storage;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DownloadUrlResponseDTO {
    @JsonProperty("download_url")
    private String downloadUrl;
}
