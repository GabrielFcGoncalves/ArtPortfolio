package server.art.data.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class UserResponseDTO {
    private UUID id;
    private String username;
    private String email;
    private String role;
    private String tier;
    
    @JsonProperty("is_verified")
    private boolean isVerified;
    
    @JsonProperty("is_active")
    private boolean isActive;
    
    @JsonProperty("created_at")
    private String createdAt;
}
