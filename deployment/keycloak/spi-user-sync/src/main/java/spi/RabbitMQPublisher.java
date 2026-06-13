package spi;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import lombok.extern.slf4j.Slf4j;
import java.nio.charset.StandardCharsets;

@Slf4j
public class RabbitMQPublisher implements EventPublisher {

    private Connection connection;
    private Channel channel;
    private final String queueName;

    public RabbitMQPublisher(String host, int port, String username, String password, String queueName) {
        this.queueName = queueName;
        log.info("Initializing RabbitMQPublisher: host={}, port={}, queue={}", host, port, queueName);
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost(host);
            factory.setPort(port);
            if (username != null && !username.isEmpty())
                factory.setUsername(username);
            if (password != null && !password.isEmpty())
                factory.setPassword(password);

            this.connection = factory.newConnection();
            this.channel = connection.createChannel();

            // Declare the queue as durable
            this.channel.queueDeclare(queueName, true, false, false, null);
            log.info("Successfully connected to RabbitMQ and declared queue: {}", queueName);
        } catch (Exception e) {
            log.error("Failed to initialize RabbitMQ Sender: " + e.getMessage(), e);
        }
    }

    @Override
    public void publish(String messageJson) throws Exception {
        if (channel != null && channel.isOpen()) {
            log.debug("Publishing message to RabbitMQ queue {}: {}", queueName, messageJson);
            channel.basicPublish("", queueName, null, messageJson.getBytes(StandardCharsets.UTF_8));
        } else {
            log.error("RabbitMQ channel is null or closed. Cannot send message.");
        }
    }

    @Override
    public void close() {
        try {
            if (channel != null && channel.isOpen())
                channel.close();
            if (connection != null && connection.isOpen())
                connection.close();
        } catch (Exception e) {
            // Ignore
        }
    }
}
