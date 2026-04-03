package server.art.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Document(collection = "messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    private String id;

    private UUID commissionId;

    private UUID senderId;

    private String senderUsername;

    private String senderAvatarUrl;

    private String content;

    @Builder.Default
    private boolean isDeleted = false;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
