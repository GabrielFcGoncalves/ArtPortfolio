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
    
    private String medium;
    private Double width;
    private Double height;
    private Double depth;
    
    @JsonProperty("dimension_unit")
    private String dimensionUnit;
    
    private Double weight;
    private Integer year;
    
    @JsonProperty("is_framed")
    private Boolean isFramed;
    
    private String category;
    
    @JsonProperty("is_published")
    private Boolean isPublished;

    @JsonProperty("is_for_sale")
    private Boolean isForSale;

    private java.math.BigDecimal price;
    private String currency;
}
