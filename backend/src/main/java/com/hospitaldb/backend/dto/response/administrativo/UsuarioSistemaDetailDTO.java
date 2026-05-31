package com.hospitaldb.backend.dto.response.administrativo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSistemaDetailDTO {
    private Long idUsuario;
    private String username;
    private String email;
    private Boolean activo;
    private String idKeycloak;
    private List<RolDTO> roles;
}
