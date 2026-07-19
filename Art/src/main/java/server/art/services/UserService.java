package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.BlockedUser;
import server.art.data.Follower;
import server.art.data.User;
import server.art.dto.PaginatedResponse;
import server.art.dto.user.UpdateProfileRequest;
import server.art.dto.user.UserProfileResponse;
import server.art.dto.user.UserPublicResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ConflictException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.BlockedUserRepository;
import server.art.repositories.FollowerRepository;
import server.art.repositories.UserRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowerRepository followerRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final IdentityService identityService;

    // --- Profile ---

    public UserPublicResponse getPublicProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return mapToPublicResponse(user);
    }

    public UserProfileResponse getCurrentUserProfile() {
        String keycloakId = identityService.getCurrentUserSub();
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for keycloak ID: " + keycloakId));
        return mapToProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateCurrentUserProfile(UpdateProfileRequest request) {
        String keycloakId = identityService.getCurrentUserSub();
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new ConflictException("Username already taken: " + request.getUsername());
            }
            user.setUsername(request.getUsername());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User saved = userRepository.save(user);
        return mapToProfileResponse(saved);
    }

    // --- Follow/Unfollow ---

    @Transactional
    public void followUser(UUID targetUserId) {
        String keycloakId = identityService.getCurrentUserSub();
        User currentUser = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        if (currentUser.getId().equals(targetUserId)) {
            throw new BusinessLogicException("Cannot follow yourself");
        }

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found: " + targetUserId));

        if (followerRepository.existsByFollowerIdAndFollowedId(currentUser.getId(), targetUserId)) {
            throw new ConflictException("Already following " + targetUser.getUsername());
        }

        Follower follow = Follower.builder()
                .followerId(currentUser.getId())
                .followedId(targetUserId)
                .build();
        followerRepository.save(follow);

        targetUser.setFollowerCount(targetUser.getFollowerCount() + 1);
        currentUser.setFollowingCount(currentUser.getFollowingCount() + 1);
        userRepository.save(targetUser);
        userRepository.save(currentUser);
    }

    @Transactional
    public void unfollowUser(UUID targetUserId) {
        String keycloakId = identityService.getCurrentUserSub();
        User currentUser = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found: " + targetUserId));

        followerRepository.deleteByFollowerIdAndFollowedId(currentUser.getId(), targetUserId);

        targetUser.setFollowerCount(Math.max(0, targetUser.getFollowerCount() - 1));
        currentUser.setFollowingCount(Math.max(0, currentUser.getFollowingCount() - 1));
        userRepository.save(targetUser);
        userRepository.save(currentUser);
    }

    public boolean isFollowing(UUID targetUserId) {
        String keycloakId = identityService.getCurrentUserSub();
        User currentUser = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
        return followerRepository.existsByFollowerIdAndFollowedId(currentUser.getId(), targetUserId);
    }

    public PaginatedResponse<UserPublicResponse> getFollowers(UUID userId, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Follower> followersPage = followerRepository.findByFollowedId(userId, pageRequest);

        List<UserPublicResponse> followers = followersPage.getContent().stream()
                .map(f -> userRepository.findById(f.getFollowerId()).orElse(null))
                .filter(u -> u != null)
                .map(this::mapToPublicResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.of(followers, followersPage.getTotalElements(), page, limit);
    }

    public PaginatedResponse<UserPublicResponse> getFollowing(UUID userId, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Follower> followingPage = followerRepository.findByFollowerId(userId, pageRequest);

        List<UserPublicResponse> following = followingPage.getContent().stream()
                .map(f -> userRepository.findById(f.getFollowedId()).orElse(null))
                .filter(u -> u != null)
                .map(this::mapToPublicResponse)
                .collect(Collectors.toList());

        return PaginatedResponse.of(following, followingPage.getTotalElements(), page, limit);
    }

    // --- Block/Unblock ---

    @Transactional
    public void blockUser(UUID targetUserId) {
        String keycloakId = identityService.getCurrentUserSub();
        User currentUser = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        if (currentUser.getId().equals(targetUserId)) {
            throw new BusinessLogicException("Cannot block yourself");
        }

        userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found: " + targetUserId));

        if (blockedUserRepository.existsByBlockerIdAndBlockedId(currentUser.getId(), targetUserId)) {
            throw new ConflictException("User already blocked");
        }

        BlockedUser block = BlockedUser.builder()
                .blockerId(currentUser.getId())
                .blockedId(targetUserId)
                .build();
        blockedUserRepository.save(block);

        // Remove existing follow relationships in both directions
        followerRepository.findByFollowerIdAndFollowedId(currentUser.getId(), targetUserId)
                .ifPresent(f -> {
                    followerRepository.delete(f);
                    User target = userRepository.findById(targetUserId).orElse(null);
                    if (target != null) {
                        target.setFollowerCount(Math.max(0, target.getFollowerCount() - 1));
                        userRepository.save(target);
                    }
                    currentUser.setFollowingCount(Math.max(0, currentUser.getFollowingCount() - 1));
                    userRepository.save(currentUser);
                });

        followerRepository.findByFollowerIdAndFollowedId(targetUserId, currentUser.getId())
                .ifPresent(f -> {
                    followerRepository.delete(f);
                    currentUser.setFollowerCount(Math.max(0, currentUser.getFollowerCount() - 1));
                    userRepository.save(currentUser);
                    User target = userRepository.findById(targetUserId).orElse(null);
                    if (target != null) {
                        target.setFollowingCount(Math.max(0, target.getFollowingCount() - 1));
                        userRepository.save(target);
                    }
                });
    }

    @Transactional
    public void unblockUser(UUID targetUserId) {
        String keycloakId = identityService.getCurrentUserSub();
        User currentUser = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        blockedUserRepository.deleteByBlockerIdAndBlockedId(currentUser.getId(), targetUserId);
    }

    public java.util.List<UserPublicResponse> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return java.util.Collections.emptyList();
        }
        return userRepository.findByUsernameContainingIgnoreCase(query).stream()
                .map(this::mapToPublicResponse)
                .collect(Collectors.toList());
    }

    // --- Mappers ---

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
                .followingCount(user.getFollowingCount())
                .commissionCount(user.getCommissionCount())
                .averageRating(user.getAverageRating())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .stripeCustomerId(user.getStripeCustomerId())
                .followerCount(user.getFollowerCount())
                .followingCount(user.getFollowingCount())
                .commissionCount(user.getCommissionCount())
                .isVerified(user.isVerified())
                .isActive(user.isActive())
                .build();
    }
}
