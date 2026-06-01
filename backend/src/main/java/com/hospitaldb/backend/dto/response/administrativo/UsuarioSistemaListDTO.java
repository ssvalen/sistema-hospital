package com.hospitaldb.backend.dto.response.administrativo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSistemaListDTO {
    private Long idUsuario;
    private String username;
    private String email;
    private Boolean activo;
    private String idKeycloak;
}
