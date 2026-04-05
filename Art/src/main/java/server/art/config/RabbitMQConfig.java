package server.art.config;

import org.springframework.amqp.core.Queue;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "message.broker", havingValue = "rabbitmq")
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "user-registration-queue";

    @Bean
    public Queue userRegistrationQueue() {
        // durable = true
        return new Queue(QUEUE_NAME, true);
    }
}
