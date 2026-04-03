package server.art.data.dto.message;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import server.art.data.dto.message.MessageSenderDTO;

@Data
@Builder
public class MessageResponseDTO {
    private String id;
    private MessageSenderDTO sender;
    private String content;
    
    @JsonProperty("created_at")
    private String createdAt;
}
