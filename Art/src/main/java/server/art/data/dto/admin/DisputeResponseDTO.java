package server.art.data.dto.admin;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class DisputeResponseDTO {
    private UUID id;
    
    @JsonProperty("commission_id")
    private UUID commissionId;
    
    @JsonProperty("reporter_id")
    private UUID reporterId;
    
    private String reason;
    private String status;
    private String resolution;
    
    @JsonProperty("created_at")
    private String createdAt;
}
