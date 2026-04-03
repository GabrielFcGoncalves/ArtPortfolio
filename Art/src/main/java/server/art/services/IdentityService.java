package server.art.services;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class IdentityService {

    public Jwt getCurrentJwt() {
        return (Jwt) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public String getCurrentUserSub() {
        return getCurrentJwt().getSubject();
    }

    public String getCurrentUserEmail() {
        return getCurrentJwt().getClaimAsString("email");
    }

    public String getCurrentUserPreferredUsername() {
        return getCurrentJwt().getClaimAsString("preferred_username");
    }
}
