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
public class RolJoinDTO {
    private Long idRol;
    private String nombreRol;

    private RolPadreDTO rolPadre;

    private List<PermisoDTO> permisos;
}
