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
    
    private String medium;
    private Double width;
    private Double height;
    private Double depth;
    
    @JsonProperty("dimension_unit")
    private String dimensionUnit;
    
    private Double weight;
    private Integer year;
    
    @JsonProperty("is_framed")
    private boolean isFramed;
    
    private String category;
    
    @JsonProperty("commission_id")
    private UUID commissionId;
    
    @JsonProperty("is_published")
    @Builder.Default
    private boolean isPublished = true;

    @JsonProperty("is_for_sale")
    private boolean isForSale;

    private java.math.BigDecimal price;
    private String currency;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UploadFileDTO {
        private String clientFileName;
        private String contentType;
    }
}
