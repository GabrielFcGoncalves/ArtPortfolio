package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import server.art.data.User;
import server.art.data.dto.auth.LogoutResponseDTO;
import server.art.dto.auth.AuthCallbackResponse;
import server.art.dto.user.UserPublicResponse;
import server.art.repositories.UserRepository;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String keycloakIssuerUri;

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
                            .lastLogin(Instant.now())
                            .build();
                    return userRepository.save(newUser);
                });

        return AuthCallbackResponse.builder()
                .user(mapToPublicResponse(user))
                .build();
    }

    public LogoutResponseDTO handleLogout() {
        String logoutUrl = keycloakIssuerUri + "/protocol/openid-connect/logout";
        return LogoutResponseDTO.builder()
                .success(true)
                .message("Logged out successfully")
                .keycloakLogoutUrl(logoutUrl)
                .build();
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
