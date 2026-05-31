package com.hospitaldb.backend.properties;


import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Valid
@Component
@ConfigurationProperties(prefix = "spring.keycloak.hospital-api")
@Data
public class KeycloakHospitalProperties {
    private String realm;
    private String clientId;
    private String clientSecret;
}
