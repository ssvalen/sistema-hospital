package com.hospitaldb.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeycloakUserRequestDTO {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Boolean enabled;
}
