package com.hospitaldb.backend.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "spring.keycloak.public")
@Data
public class KeycloakPublicProperties {
    private String realm;
    private String clientId;
    private String clientSecret;
}