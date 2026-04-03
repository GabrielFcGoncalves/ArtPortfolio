package server.art.dto.user;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String username;

    @Size(max = 500, message = "Bio must be at most 500 characters")
    private String bio;

    @Size(max = 1024, message = "Avatar URL is too long")
    private String avatarUrl;
}
