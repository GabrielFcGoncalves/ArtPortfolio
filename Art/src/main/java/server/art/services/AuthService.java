package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import server.art.data.User;
import server.art.dto.auth.AuthCallbackResponse;
import server.art.dto.user.UserPublicResponse;
import server.art.repositories.UserRepository;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String keycloakIssuerUri;

    /**
     * Handle OAuth callback: upsert user record based on Keycloak JWT claims.
     * In a full implementation this would exchange the auth code for a token,
     * but since the frontend uses keycloak-js, the token exchange happens client-side.
     * This endpoint is called after the frontend has the token to sync the user in our DB.
     */
    public AuthCallbackResponse handleCallback(String keycloakSub, String email, String preferredUsername, String role) {
        User user = userRepository.findByKeycloakId(keycloakSub)
                .map(existing -> {
                    existing.setLastLogin(Instant.now());
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .keycloakId(keycloakSub)
                            .email(email)
                            .username(preferredUsername)
                            .role(role != null ? role : "USER")
                            .build();
                    return userRepository.save(newUser);
                });

        UserPublicResponse userResponse = mapToPublicResponse(user);

        return AuthCallbackResponse.builder()
                .user(userResponse)
                .build();
    }

    /**
     * Build the Keycloak logout URL for frontend redirect.
     */
    public Map<String, Object> handleLogout() {
        String logoutUrl = keycloakIssuerUri + "/protocol/openid-connect/logout";
        return Map.of(
                "success", true,
                "message", "Logged out successfully",
                "keycloak_logout_url", logoutUrl
        );
    }

    private UserPublicResponse mapToPublicResponse(User user) {
        return UserPublicResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .isVerified(user.isVerified())
                .isFeatured(user.isFeatured())
                .followerCount(user.getFollowerCount())
                .commissionCount(user.getCommissionCount())
                .averageRating(user.getAverageRating())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
