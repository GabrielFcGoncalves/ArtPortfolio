package server.art.data.dto.portfolio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class ArtPieceCreateRequestDTO {
    private String title;
    private String description;
    private String tags;
    
    @JsonProperty("commission_id")
    private UUID commissionId;
    
    @JsonProperty("is_published")
    @Builder.Default
    private boolean isPublished = true;
}
