package com.hospitaldb.backend.dto.response.administrativo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolPadreDTO {
    private Long idRolPadre;
    private String nombreRolPadre;
}
