package server.art.data.dto.portfolio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtPieceCreateRequestDTO {
    private String title;
    private String description;
    private String tags;
    private List<UploadFileDTO> files;
    
    @JsonProperty("commission_id")
    private UUID commissionId;
    
    @JsonProperty("is_published")
    @Builder.Default
    private boolean isPublished = true;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UploadFileDTO {
        private String clientFileName;
        private String contentType;
    }
}
