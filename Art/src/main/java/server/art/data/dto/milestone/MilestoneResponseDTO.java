package server.art.data.dto.milestone;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import server.art.data.dto.portfolio.ArtPieceAssetResponseDTO;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class MilestoneResponseDTO {
    private UUID id;
    private String title;
    private String description;
    private String status;
    private int order_index;
    
    @JsonProperty("assets")
    private List<ArtPieceAssetResponseDTO> assets;
}
