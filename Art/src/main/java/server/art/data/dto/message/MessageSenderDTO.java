package server.art.data.dto.message;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class MessageSenderDTO {
    private UUID id;
    private String username;
    
    @JsonProperty("avatar_url")
    private String avatarUrl;
}
