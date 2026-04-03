package server.art.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import server.art.dto.user.UserPublicResponse;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthCallbackResponse {

    private String accessToken;
    private UserPublicResponse user;
}
