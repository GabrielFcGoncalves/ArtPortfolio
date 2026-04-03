package server.art.data.dto.milestone;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class RevisionRequestResponseDTO {
    private UUID id;
    
    @JsonProperty("milestone_id")
    private UUID milestoneId;
    
    private String feedback;
    private String status;
    
    @JsonProperty("created_at")
    private String createdAt;
}
