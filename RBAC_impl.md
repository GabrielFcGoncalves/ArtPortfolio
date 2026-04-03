# Implementation Guide: Keycloak RBAC & Token Propagation in Spring Boot 3.x

This document details the technical implementation for securing a Spring Boot Resource Server with Keycloak, mapping roles to Spring Security Authorities, and accessing JWT claims within the service layer.

---

## 1. Dependencies (Maven)

Ensure your `pom.xml` includes the OAuth2 Resource Server starter.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

2. Keycloak Role Converter Logic

Keycloak nests roles inside the realm_access claim. Spring Security expects roles to be in a flat list of GrantedAuthority objects, usually prefixed with ROLE_.
Java

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import java.util.*;
import java.util.stream.Collectors;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Map<String, Object> realmAccess = (Map<String, Object>) jwt.getClaims().get("realm_access");

        if (realmAccess == null || realmAccess.isEmpty()) {
            return Collections.emptyList();
        }

        return ((List<String>) realmAccess.get("roles")).stream()
                .map(roleName -> "ROLE_" + roleName) // Maps 'admin' to 'ROLE_admin'
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}

3. Security Configuration

Configure the SecurityFilterChain to use the custom converter and enforce RBAC on specific endpoints.
Java

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize support
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/artist/**").hasRole("ARTIST")
                .requestMatchers("/api/user/**").hasRole("USER")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
            );

        return http.build();
    }
}

4. Accessing User Data in Services
A. Inside a Controller (Recommended)

Use @AuthenticationPrincipal to get the JWT directly.
Java

@RestController
@RequestMapping("/api/commissions")
public class CommissionController {

    @PostMapping("/create")
    public ResponseEntity<?> create(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject(); // The 'sub' claim (User UUID)
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok("User ID: " + keycloakId);
    }
}

B. Inside a Service Layer (Global Context)

If you are deep in the business logic, pull the token from the SecurityContextHolder.
Java

@Service
public class IdentityService {

    public String getCurrentUserSub() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext()
                                             .getAuthentication()
                                             .getPrincipal();
        return jwt.getSubject();
    }
}

5. application.yml Configuration

Link your Spring Boot app to your Keycloak instance.
YAML

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8081/realms/platform
          jwk-set-uri: http://localhost:8081/realms/platform/protocol/openid-connect/certs

6. Keycloak Admin Setup Requirements

    Client Protocol: OpenID Connect.

    Clients:
    - react: Public client for the frontend.
    - api: Resource server client with authorization enabled.

    Roles: Create Realm Roles named ADMIN, ARTIST, and USER.

    Mappers: Ensure the realm_access claim is included in the Access Token (this is default in most Keycloak versions, but verify in "Client Scopes" -> "roles").

7. Testing Credentials (from imports)

| Username | Password | Role |
| :--- | :--- | :--- |
| platform_admin | admin | ADMIN |
| platform_artist | admin | ARTIST |
| platform_user | admin | USER |

```

# Implementation Guide: Keycloak RBAC & Token Propagation in Spring Boot 3.x

This document details the technical implementation for securing a Spring Boot Resource Server with Keycloak, mapping roles to Spring Security Authorities, and accessing JWT claims within the service layer.

---

## 1. Dependencies (Maven)

Ensure your `pom.xml` includes the OAuth2 Resource Server starter.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

2. Keycloak Role Converter Logic

Keycloak nests roles inside the realm_access claim. Spring Security expects roles to be in a flat list of GrantedAuthority objects, usually prefixed with ROLE_.
Java

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import java.util.*;
import java.util.stream.Collectors;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Map<String, Object> realmAccess = (Map<String, Object>) jwt.getClaims().get("realm_access");

        if (realmAccess == null || realmAccess.isEmpty()) {
            return Collections.emptyList();
        }

        return ((List<String>) realmAccess.get("roles")).stream()
                .map(roleName -> "ROLE_" + roleName) // Maps 'admin' to 'ROLE_admin'
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}

3. Security Configuration

Configure the SecurityFilterChain to use the custom converter and enforce RBAC on specific endpoints.
Java

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize support
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/artist/**").hasAnyRole("ARTIST", "ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
            );

        return http.build();
    }
}

4. Accessing User Data in Services
A. Inside a Controller (Recommended)

Use @AuthenticationPrincipal to get the JWT directly.
Java

@RestController
@RequestMapping("/api/commissions")
public class CommissionController {

    @PostMapping("/create")
    public ResponseEntity<?> create(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject(); // The 'sub' claim (User UUID)
        String email = jwt.getClaimAsString("email");
        return ResponseEntity.ok("User ID: " + keycloakId);
    }
}

B. Inside a Service Layer (Global Context)

If you are deep in the business logic, pull the token from the SecurityContextHolder.
Java

@Service
public class IdentityService {

    public String getCurrentUserSub() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext()
                                             .getAuthentication()
                                             .getPrincipal();
        return jwt.getSubject();
    }
}

5. application.yml Configuration

Link your Spring Boot app to your Keycloak instance.
YAML

spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://<keycloak-domain>/realms/<your-realm>
          jwk-set-uri: https://<keycloak-domain>/realms/<your-realm>/protocol/openid-connect/certs

6. Keycloak Admin Setup Requirements

    Client Protocol: OpenID Connect.

    Access Type: Confidential (or Public if calling directly from React).

    Roles: Create Realm Roles named ADMIN and ARTIST.

    Mappers: Ensure the realm_access claim is included in the Access Token (this is default in most Keycloak versions, but verify in "Client Scopes" -> "roles").
```
