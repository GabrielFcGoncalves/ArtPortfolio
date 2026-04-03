package server.art.data.dto.user;

import lombok.Builder;
import lombok.Data;
import server.art.dto.user.UserProfileResponse;

@Data
@Builder
public class UserUpdateResponseDTO {
    private boolean success;
    private UserProfileResponse user;
}
