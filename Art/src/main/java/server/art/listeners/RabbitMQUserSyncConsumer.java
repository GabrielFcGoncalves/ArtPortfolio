package server.art.listeners;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RabbitMQUserSyncConsumer {

    private final UserRegistrationProcessor processor;

    public RabbitMQUserSyncConsumer(UserRegistrationProcessor processor) {
        this.processor = processor;
        log.info("Initialized RabbitMQ User Sync Consumer");
    }

    @RabbitListener(queues = "users.user_creation")
    public void receiveMessage(String messageBody) {
        log.info("Received message from RabbitMQ: {}", messageBody);
        try {
            processor.processRegistration(messageBody);
        } catch (Exception e) {
            log.error("Failed to process RabbitMQ message: {}", e.getMessage(), e);
            throw new RuntimeException("Requeue message", e); // Throwing exception requeues by default in spring AMQP
        }
    }
}
