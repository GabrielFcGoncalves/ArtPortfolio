package server.art.data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String keycloakId;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @Builder.Default
    private String role = "USER";

    @Column(nullable = false)
    @Builder.Default
    private String tier = "freemium";

    @Column(length = 1024)
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String stripeCustomerId;

    @Builder.Default
    private boolean isVerified = false;

    @Builder.Default
    private boolean isActive = true;

    @Builder.Default
    private boolean isFeatured = false;

    @Builder.Default
    private int followerCount = 0;

    @Builder.Default
    private int followingCount = 0;

    @Builder.Default
    private int commissionCount = 0;

    @Builder.Default
    private int portfolioCount = 0;

    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;

    private Instant lastLogin;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
