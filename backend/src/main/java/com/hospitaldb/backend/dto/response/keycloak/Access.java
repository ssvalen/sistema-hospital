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
public class Access {
    @JsonProperty("manageGroupMembership")
    private boolean manageGroupMembership;

    private boolean view;

    @JsonProperty("mapRoles")
    private boolean mapRoles;

    private boolean impersonate;
    private boolean manage;
}
