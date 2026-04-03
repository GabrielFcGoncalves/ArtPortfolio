package server.art.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.art.data.dto.user.*;
import server.art.data.dto.common.*;
import server.art.dto.PaginatedResponse;
import server.art.dto.user.UpdateProfileRequest;
import server.art.dto.user.UserProfileResponse;
import server.art.dto.user.UserPublicResponse;
import server.art.services.UserService;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @PatchMapping("/me")
    public ResponseEntity<UserUpdateResponseDTO> updateCurrentUser(@Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse updated = userService.updateCurrentUserProfile(request);
        return ResponseEntity.ok(UserUpdateResponseDTO.builder()
                .success(true)
                .user(updated)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserPublicResponse> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getPublicProfile(id));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<SimpleMessageResponseDTO> followUser(@PathVariable UUID id) {
        userService.followUser(id);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(SimpleMessageResponseDTO.builder()
                        .success(true)
                        .message("Now following user")
                        .build());
    }

    @DeleteMapping("/{id}/follow")
    public ResponseEntity<SimpleMessageResponseDTO> unfollowUser(@PathVariable UUID id) {
        userService.unfollowUser(id);
        return ResponseEntity.ok(SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Unfollowed user")
                .build());
    }

    @GetMapping("/{id}/is-following")
    public ResponseEntity<IsFollowingResponseDTO> isFollowing(@PathVariable UUID id) {
        boolean following = userService.isFollowing(id);
        return ResponseEntity.ok(IsFollowingResponseDTO.builder()
                .isFollowing(following)
                .build());
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<PaginatedResponse<UserPublicResponse>> getFollowers(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(userService.getFollowers(id, page, limit));
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<PaginatedResponse<UserPublicResponse>> getFollowing(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(userService.getFollowing(id, page, limit));
    }

    @PostMapping("/{id}/block")
    public ResponseEntity<SimpleMessageResponseDTO> blockUser(@PathVariable UUID id) {
        userService.blockUser(id);
        return ResponseEntity.ok(SimpleMessageResponseDTO.builder()
                .success(true)
                .message("User blocked")
                .build());
    }

    @DeleteMapping("/{id}/block")
    public ResponseEntity<SimpleMessageResponseDTO> unblockUser(@PathVariable UUID id) {
        userService.unblockUser(id);
        return ResponseEntity.ok(SimpleMessageResponseDTO.builder()
                .success(true)
                .message("User unblocked")
                .build());
    }
}
