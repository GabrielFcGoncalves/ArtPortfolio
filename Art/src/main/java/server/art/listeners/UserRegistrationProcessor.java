package server.art.listeners;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import server.art.data.User;
import server.art.repositories.UserRepository;

@Slf4j
@Service
public class UserRegistrationProcessor {

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public UserRegistrationProcessor(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.objectMapper = new ObjectMapper();
    }

    public void processRegistration(String messageBody) throws Exception {
        log.info("Processing new user registration: {}", messageBody);
        
        JsonNode payload = objectMapper.readTree(messageBody);
        String keycloakId = payload.has("keycloakId") ? payload.get("keycloakId").asText() : null;
        String username = payload.has("username") ? payload.get("username").asText() : null;
        String email = payload.has("email") ? payload.get("email").asText() : null;

        if (keycloakId == null || username == null || email == null) {
            log.error("Invalid payload. Missing required fields.");
            throw new IllegalArgumentException("Invalid payload");
        }

        if (userRepository.findByKeycloakId(keycloakId).isPresent()) {
            log.info("User already exists in Postgres. Skipping creation.");
            return;
        }

        User newUser = User.builder()
                .keycloakId(keycloakId)
                .username(username)
                .email(email)
                .role("USER")
                .tier("freemium")
                .build();

        userRepository.save(newUser);
        log.info("Successfully created Postgres user for Keycloak ID: {}", keycloakId);
    }
}
