package server.art.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${stripe.secret-key}")
    private String secretKey;

    @Value("${stripe.platform-fee-percent}")
    private int platformFeePercent;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public int getPlatformFeePercent() {
        return platformFeePercent;
    }
}
