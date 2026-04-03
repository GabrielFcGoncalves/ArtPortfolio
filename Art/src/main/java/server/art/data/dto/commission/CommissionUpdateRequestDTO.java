package server.art.data.dto.commission;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommissionUpdateRequestDTO {
    private String title;
    private String description;
    
    @JsonProperty("revision_limit")
    private Integer revisionLimit;
}
