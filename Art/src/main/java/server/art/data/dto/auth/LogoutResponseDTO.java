package server.art.data.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LogoutResponseDTO {
    private boolean success;
    private String message;
    
    @JsonProperty("keycloak_logout_url")
    private String keycloakLogoutUrl;
}
