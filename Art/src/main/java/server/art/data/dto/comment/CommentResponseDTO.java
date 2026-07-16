package server.art.data.dto.comment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {
    private UUID id;

    @JsonProperty("user_id")
    private UUID userId;

    private String username;

    @JsonProperty("user_avatar_url")
    private String userAvatarUrl;

    private String content;

    @JsonProperty("parent_id")
    private UUID parentId;

    @JsonProperty("created_at")
    private String createdAt;

    private List<CommentResponseDTO> replies;
}
