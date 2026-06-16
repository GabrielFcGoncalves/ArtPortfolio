package server.art.data.dto.commission;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import server.art.data.dto.milestone.MilestoneResponseDTO;

import java.util.List;

@Data
@Builder
public class CommissionDetailResponseDTO {
    private String id;
    private String title;
    private String description;
    private String status;
    
    @JsonProperty("total_price_cents")
    private long totalPriceCents;
    
    @JsonProperty("client_id")
    private String clientId;
    
    @JsonProperty("client_username")
    private String clientUsername;
    
    @JsonProperty("artist_id")
    private String artistId;
    
    @JsonProperty("artist_username")
    private String artistUsername;
    
    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("reference_image_urls")
    private List<String> referenceImageUrls;
    
    private List<MilestoneResponseDTO> milestones;
}
