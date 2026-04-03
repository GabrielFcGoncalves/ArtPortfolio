package server.art.data.dto.commission;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import server.art.data.dto.milestone.MilestoneResponseDTO;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CommissionDetailResponseDTO {
    private String id;
    private String title;
    private String description;
    private String status;
    
    @JsonProperty("total_price_cents")
    private long totalPriceCents;
    
    @JsonProperty("client_username")
    private String clientUsername;
    
    @JsonProperty("artist_username")
    private String artistUsername;
    
    private List<MilestoneResponseDTO> milestones;
}
