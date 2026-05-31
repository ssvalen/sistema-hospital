package com.hospitaldb.backend.dto.response.keycloak;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KeycloakUserListResponseDTO {
    private List<KeycloakUserResponseDTO> data;
    private int total;
    private int page;
    private int size;
}
