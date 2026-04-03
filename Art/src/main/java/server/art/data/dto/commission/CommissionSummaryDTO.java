package server.art.data.dto.commission;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import server.art.data.enums.CommissionStatus;
import server.art.data.enums.EscrowStatus;
import java.util.UUID;

@Data
@Builder
public class CommissionSummaryDTO {
    private UUID id;
    private String title;
    private String status;
    
    @JsonProperty("client_username")
    private String clientUsername;
    
    @JsonProperty("artist_username")
    private String artistUsername;
    
    @JsonProperty("total_price_cents")
    private long totalPriceCents;
    
    @JsonProperty("created_at")
    private String createdAt;
}
