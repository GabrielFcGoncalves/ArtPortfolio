package server.art.data.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IsFollowingResponseDTO {
    @JsonProperty("is_following")
    private boolean isFollowing;
}
