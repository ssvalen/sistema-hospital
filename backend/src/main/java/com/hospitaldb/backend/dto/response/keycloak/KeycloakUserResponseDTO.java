package com.hospitaldb.backend.dto.response.keycloak;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class KeycloakUserResponseDTO {
    private String id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;

    @JsonProperty("emailVerified")
    private boolean emailVerified;

    @JsonProperty("createdTimestamp")
    private long createdTimestamp;

    private boolean enabled;
    private boolean totp;

    @JsonProperty("disableableCredentialTypes")
    private List<String> disableableCredentialTypes;

    @JsonProperty("requiredActions")
    private List<String> requiredActions;

    @JsonProperty("notBefore")
    private int notBefore;

    private Access access;
}
