package spi;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventListenerProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

@Slf4j
public class UserEventListenerFactory implements EventListenerProviderFactory {

    private EventPublisher publisher;

    @Override
    public EventListenerProvider create(KeycloakSession session) {
        return new UserEventListener(session, publisher);
    }

    @Override
    public void init(org.keycloak.Config.Scope config) {
        log.info("Initializing UserEventListenerFactory...");

        String host = System.getenv("RABBITMQ_HOST");
        String portStr = System.getenv("RABBITMQ_PORT");
        String username = System.getenv("RABBITMQ_USERNAME");
        String password = System.getenv("RABBITMQ_PASSWORD");

        int port = Integer.parseInt(portStr);

        log.info("Configuring RabbitMQ Publisher for Keycloak: host={}, port={}", host, port);
        this.publisher = new RabbitMQPublisher(host, port, username, password, "users.user_creation");

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
