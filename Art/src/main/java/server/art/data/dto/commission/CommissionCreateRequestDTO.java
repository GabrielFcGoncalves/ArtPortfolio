package server.art.data.dto.commission;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionCreateRequestDTO {
    @JsonProperty("artist_id")
    private UUID artistId;
    
    private String title;
    private String description;
    
    @JsonProperty("total_price_cents")
    @Builder.Default
    private long totalPriceCents = 0;
    
    @JsonProperty("is_physical")
    private boolean isPhysical;
    
    @JsonProperty("revision_limit")
    @Builder.Default
    private int revisionLimit = 3;
    
    @JsonProperty("due_date")
    private String dueDate;

    @JsonProperty("reference_image_urls")
    private List<String> referenceImageUrls;
}
