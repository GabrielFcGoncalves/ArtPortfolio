package server.art.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import server.art.dto.PaginatedResponse;
import server.art.dto.user.UpdateProfileRequest;
import server.art.dto.user.UserProfileResponse;
import server.art.dto.user.UserPublicResponse;
import server.art.services.UserService;

import java.util.Map;
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
    public ResponseEntity<Map<String, Object>> updateCurrentUser(@Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse updated = userService.updateCurrentUserProfile(request);
        return ResponseEntity.ok(Map.of("success", true, "user", updated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserPublicResponse> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getPublicProfile(id));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Map<String, Object>> followUser(@PathVariable UUID id) {
        userService.followUser(id);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "message", "Now following user"));
    }

    @DeleteMapping("/{id}/follow")
    public ResponseEntity<Map<String, Object>> unfollowUser(@PathVariable UUID id) {
        userService.unfollowUser(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Unfollowed user"));
    }

    @GetMapping("/{id}/is-following")
    public ResponseEntity<Map<String, Boolean>> isFollowing(@PathVariable UUID id) {
        boolean following = userService.isFollowing(id);
        return ResponseEntity.ok(Map.of("is_following", following));
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
    public ResponseEntity<Map<String, Object>> blockUser(@PathVariable UUID id) {
        userService.blockUser(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "User blocked"));
    }

    @DeleteMapping("/{id}/block")
    public ResponseEntity<Map<String, Object>> unblockUser(@PathVariable UUID id) {
        userService.unblockUser(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "User unblocked"));
    }
}
