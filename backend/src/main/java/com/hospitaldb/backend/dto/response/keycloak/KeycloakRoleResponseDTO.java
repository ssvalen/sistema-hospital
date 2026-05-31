package com.hospitaldb.backend.dto.response.keycloak;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class KeycloakRoleResponseDTO {
    private String id;
    private String name;
    private String description;
    private boolean composite;

    @JsonProperty("clientRole")
    private boolean clientRole;

    @JsonProperty("containerId")
    private String containerId;
}
