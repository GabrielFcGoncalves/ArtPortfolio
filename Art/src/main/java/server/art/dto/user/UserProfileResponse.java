package server.art.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private UUID id;
    private String email;
    private String username;
    private String bio;
    private String avatarUrl;
    private String role;
    private String stripeCustomerId;
    private int followerCount;
    private int followingCount;
    private int commissionCount;
    private boolean isVerified;
    private boolean isActive;
}
