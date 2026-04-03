package server.art.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthCallbackRequest {

    @NotBlank(message = "Authorization code is required")
    private String code;

    @NotBlank(message = "State parameter is required")
    private String state;
}
