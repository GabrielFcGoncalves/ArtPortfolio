package server.art.data.dto.portfolio;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class ArtPieceAssetResponseDTO {
    private UUID id;
    private String blobUrl;
    private int sequenceOrder;
    private String uploadUrl;
}
