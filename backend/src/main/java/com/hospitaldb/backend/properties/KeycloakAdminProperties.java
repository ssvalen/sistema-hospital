package com.hospitaldb.backend.properties;

import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Valid
@Component
@ConfigurationProperties(prefix = "spring.keycloak.admin")
@Data
public class KeycloakAdminProperties {
    private String serverUrl;
    private String realm;
    private String clientId;
    private String user;
    private String password;
    private String targetRealm;
}
