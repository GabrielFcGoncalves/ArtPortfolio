package server.art.data.dto.social;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FavoriteToggleResponseDTO {
    @JsonProperty("is_favorited")
    private boolean isFavorited;

    @JsonProperty("favorite_count")
    private int favoriteCount;
}
