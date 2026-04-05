package spi;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.jboss.logging.Logger;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import java.util.HashMap;
import java.util.Map;

public class UserEventListener implements EventListenerProvider {

    private static final Logger logger = Logger.getLogger(UserEventListener.class);

    private final KeycloakSession session;
    private final EventPublisher publisher;
    private final ObjectMapper mapper;

    public UserEventListener(KeycloakSession session, EventPublisher publisher) {
        this.session = session;
        this.publisher = publisher;
        this.mapper = new ObjectMapper();
    }

    @Override
    public void onEvent(Event event) {
        if (EventType.REGISTER.equals(event.getType())) {
            try {
                // Fetch the user from the session
                RealmModel realm = session.realms().getRealm(event.getRealmId());
                UserModel user = session.users().getUserById(realm, event.getUserId());

                if (user != null) {
                    Map<String, String> payload = new HashMap<>();
                    payload.put("keycloakId", user.getId());
                    payload.put("username", user.getUsername());
                    payload.put("email", user.getEmail());

                    String json = mapper.writeValueAsString(payload);
                    logger.debug("Keycloak emitting REGISTER event to Service Bus -> " + json);
                    
                    if (publisher != null) {
                        publisher.publish(json);
                    } else {
                        logger.error("Publisher client is null. Cannot send message.");
                    }
                }
            } catch (Exception e) {
                logger.error("Failed to publish registration event to Service Bus: " + e.getMessage(), e);
            }
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean b) {
        // We only care about user-driven registration for now
    }

    @Override
    public void close() {
        // No-op
    }
}
