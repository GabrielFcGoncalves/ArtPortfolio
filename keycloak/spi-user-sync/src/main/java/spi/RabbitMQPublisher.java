package spi;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import org.jboss.logging.Logger;

public class RabbitMQPublisher implements EventPublisher {

    private static final Logger logger = Logger.getLogger(RabbitMQPublisher.class);
    private Connection connection;
    private Channel channel;
    private final String queueName;

    public RabbitMQPublisher(String host, int port, String username, String password, String queueName) {
        this.queueName = queueName;
        try {
            ConnectionFactory factory = new ConnectionFactory();
            factory.setHost(host);
            factory.setPort(port);
            if (username != null && !username.isEmpty()) factory.setUsername(username);
            if (password != null && !password.isEmpty()) factory.setPassword(password);

            this.connection = factory.newConnection();
            this.channel = connection.createChannel();
            
            // Declare the queue as durable
            this.channel.queueDeclare(queueName, true, false, false, null);
            logger.debug("Successfully initialized RabbitMQ Sender in Keycloak.");
        } catch (Exception e) {
            logger.error("Failed to initialize RabbitMQ Sender: " + e.getMessage());
        }
    }

    @Override
    public void publish(String messageJson) throws Exception {
        if (channel != null && channel.isOpen()) {
            channel.basicPublish("", queueName, null, messageJson.getBytes("UTF-8"));
        } else {
            logger.error("RabbitMQ channel is null or closed. Cannot send message.");
        }
    }

    @Override
    public void close() {
        try {
            if (channel != null && channel.isOpen()) channel.close();
            if (connection != null && connection.isOpen()) connection.close();
        } catch (Exception e) {
            // Ignore
        }
    }
}
