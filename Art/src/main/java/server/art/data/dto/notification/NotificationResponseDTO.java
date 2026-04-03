package server.art.data.dto.notification;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import server.art.data.enums.NotificationType;
import java.util.UUID;

@Data
@Builder
public class NotificationResponseDTO {
    private UUID id;
    private NotificationType type;
    private String title;
    private String message;
    
    @JsonProperty("related_commission_id")
    private UUID relatedCommissionId;
    
    @JsonProperty("related_user_id")
    private UUID relatedUserId;
    
    @JsonProperty("is_read")
    private boolean isRead;
    
    @JsonProperty("created_at")
    private String createdAt;
}
