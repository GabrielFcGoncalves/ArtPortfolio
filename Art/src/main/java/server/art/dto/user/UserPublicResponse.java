package server.art.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPublicResponse {

    private UUID id;
    private String username;
    private String bio;
    private String avatarUrl;
    private String role;
    private boolean isVerified;
    private boolean isFeatured;
    private int followerCount;
    private int followingCount;
    private int commissionCount;
    private BigDecimal averageRating;
    private Instant createdAt;
}
