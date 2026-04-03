package server.art.data.dto.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentSessionResponseDTO {
    @JsonProperty("session_id")
    private String sessionId;
    
    @JsonProperty("checkout_url")
    private String checkoutUrl;
}
