package server.art.data.dto.portfolio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ArtPieceResponseDTO {
    private UUID id;
    private String title;
    private String description;
    
    @JsonProperty("cover_image")
    private String coverImage;
    
    @JsonProperty("asset_count")
    private int assetCount;
    
    @JsonProperty("created_at")
    private String createdAt;
    
    @JsonProperty("user_id")
    private UUID userId;
    
    @JsonProperty("keycloak_id")
    private String keycloakId;
    
    @JsonProperty("username")
    private String username;

    @JsonProperty("artist_avatar_url")
    private String artistAvatarUrl;

    @JsonProperty("is_published")
    private boolean isPublished;

    @JsonProperty("is_for_sale")
    private boolean isForSale;

    private java.math.BigDecimal price;

    private String currency;
    
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
    
    @JsonProperty("view_count")
    private int viewCount;
    
    @JsonProperty("favorite_count")
    private int favoriteCount;
    
    @JsonProperty("is_favorited")
    private boolean isFavorited;
    
    private List<ArtPieceAssetResponseDTO> assets;

    @JsonProperty("is_published")
    public boolean isPublished() {
        return isPublished;
    }
}
