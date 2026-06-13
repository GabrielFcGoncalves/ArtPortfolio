package spi;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.events.admin.AdminEvent;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class UserEventListener implements EventListenerProvider {

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
        log.info("Received Keycloak Event: type={}, realm={}, user={}", event.getType(), event.getRealmId(),
                event.getUserId());

        if (EventType.REGISTER.equals(event.getType())) {
            log.info("Processing REGISTER event for user: {}", event.getUserId());

            try {
                RealmModel realm = session.realms().getRealm(event.getRealmId());
                UserModel user = session.users().getUserById(realm, event.getUserId());

                if (user != null) {
                    Map<String, String> payload = new HashMap<>();
                    payload.put("keycloakId", user.getId());
                    payload.put("username", user.getUsername());
                    payload.put("email", user.getEmail());

                    String json = mapper.writeValueAsString(payload);
                    log.debug("Keycloak emitting REGISTER event to Service Bus -> " + json);

                    if (publisher != null) {
                        publisher.publish(json);
                    } else {
                        log.error("Publisher client is null. Cannot send message.");
                    }
                }
            } catch (Exception e) {
                log.error("Failed to publish registration event to Service Bus: " + e.getMessage(), e);
            }
        }
    }

    @Override
    public void onEvent(AdminEvent adminEvent, boolean b) {
        log.info("Received Keycloak Admin Event: operation={}, resourcePath={}, realm={}",
                adminEvent.getOperationType(), adminEvent.getResourcePath(), adminEvent.getRealmId());

        if ("USER".equals(adminEvent.getResourceType().name())
                && "CREATE".equals(adminEvent.getOperationType().name())) {
            try {
                // Resource path for user creation is usually "users/UUID"
                String resourcePath = adminEvent.getResourcePath();
                String userId = resourcePath.split("/")[1];

                RealmModel realm = session.realms().getRealm(adminEvent.getRealmId());
                UserModel user = session.users().getUserById(realm, userId);

                if (user != null) {
                    Map<String, String> payload = new HashMap<>();
                    payload.put("keycloakId", user.getId());
                    payload.put("username", user.getUsername());
                    payload.put("email", user.getEmail());

                    String json = mapper.writeValueAsString(payload);
                    log.info("Admin sync: emitting event -> {}", json);

                    if (publisher != null) {
                        publisher.publish(json);
                    }
                }
            } catch (Exception e) {
                log.error("Failed to sync Admin-created user: " + e.getMessage(), e);
            }
        }
    }

    @Override
    public void close() {
        // No-op
    }
}
