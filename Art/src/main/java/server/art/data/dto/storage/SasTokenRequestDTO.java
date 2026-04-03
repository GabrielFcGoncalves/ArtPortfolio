package server.art.data.dto.storage;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SasTokenRequestDTO {
    @JsonProperty("file_name")
    private String fileName;
    
    @JsonProperty("file_type")
    private String fileType;
    
    private String container;
}
