package server.art.config;

import java.util.HashMap;
import java.util.Map;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "users.user_creation";

    @Bean
    public Queue userRegistrationQueue() {
        Map<String, Object> args = new HashMap<>();
        args.put("x-queue-type", "classic");
        args.put("x-dead-letter-exchange", "user-registration.dlx");
        args.put("x-dead-letter-routing-key", "dead-letter");
        return new Queue(QUEUE_NAME, true, false, false, args);
    }
}
