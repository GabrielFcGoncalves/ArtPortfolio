package server.art.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import server.art.data.User;
import server.art.data.dto.auth.LogoutResponseDTO;
import server.art.dto.auth.AuthCallbackResponse;
import server.art.dto.user.UserPublicResponse;
import server.art.repositories.UserRepository;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String keycloakIssuerUri;

    public AuthCallbackResponse handleCallback(String keycloakSub, String email, String preferredUsername, String role) {
        log.info("Auth callback received for user: sub={}, email={}, username={}, role={}", keycloakSub, email, preferredUsername, role);
        
        User user = userRepository.findByKeycloakId(keycloakSub)
                .map(existing -> {
                    log.info("Existing user found in database with ID {}. Updating last login.", existing.getId());
                    existing.setLastLogin(Instant.now());
                    return userRepository.save(existing);
                })
                .orElseGet(() -> {
                    log.info("No existing user found in database. Creating new user record for username: {}", preferredUsername);
                    User newUser = User.builder()
                            .keycloakId(keycloakSub)
                            .email(email)
                            .username(preferredUsername)
                            .role(role != null ? role : "USER")
                            .lastLogin(Instant.now())
                            .build();
                    User saved = userRepository.save(newUser);
                    log.info("Successfully created and saved new database user with ID: {}", saved.getId());
                    return saved;
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
