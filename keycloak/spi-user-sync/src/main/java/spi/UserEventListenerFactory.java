package spi;


import org.jboss.logging.Logger;
import org.keycloak.Config;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

public class UserEventListenerFactory implements EventListenerProviderFactory {

    private static final Logger logger = Logger.getLogger(UserEventListenerFactory.class);
    private EventPublisher publisher;

    @Override
    public EventListenerProvider create(KeycloakSession session) {
        return new UserEventListener(session, publisher);
    }

    @Override
    public void init(Config.Scope config) {
        String brokerType = System.getenv("MESSAGE_BROKER");
        if (brokerType == null) {
            brokerType = "servicebus";
        }

        if ("rabbitmq".equalsIgnoreCase(brokerType)) {
            String host = System.getenv("RABBITMQ_HOST");
            if (host == null) host = "localhost";
            String portStr = System.getenv("RABBITMQ_PORT");
            int port = (portStr != null) ? Integer.parseInt(portStr) : 5672;
            String username = System.getenv("RABBITMQ_USERNAME");
            String password = System.getenv("RABBITMQ_PASSWORD");
            
            this.publisher = new RabbitMQPublisher(host, port, username, password, "user-registration-queue");
        } else {
            String connectionString = System.getenv("SPRING_SERVICE_BUS_CONNECTION_STRING");
            if (connectionString != null && !connectionString.isEmpty()) {
                this.publisher = new AzureServiceBusPublisher(connectionString, "user-registration-queue");
            } else {
                logger.warn("SPRING_SERVICE_BUS_CONNECTION_STRING is not set. Azure Service Bus sync will fail.");
            }
        }
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {
        // No post-initialization required
    }

    @Override
    public void close() {
        if (publisher != null) {
            try {
                publisher.close();
            } catch (Exception e) {
                // Ignore close exceptions
            }
        }
    }

    @Override
    public String getId() {
        return "user-sync-listener";
    }
}

