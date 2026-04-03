package server.art.data.dto.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentStatusResponseDTO {
    private String status;
    
    @JsonProperty("amount_cents")
    private long amountCents;
    
    @JsonProperty("stripe_payment_id")
    private String stripePaymentId;
    
    @JsonProperty("created_at")
    private String createdAt;
    
    @JsonProperty("completed_at")
    private String completedAt;
}
