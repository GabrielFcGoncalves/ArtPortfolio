package server.art.data.dto.portfolio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ArtPieceUpdateRequestDTO {
    private String title;
    private String description;
    private String tags;
    
    @JsonProperty("is_published")
    private Boolean isPublished;
}
