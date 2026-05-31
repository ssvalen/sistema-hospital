package com.hospitaldb.backend.dto.response.administrativo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RolDTO {
    private Long idRol;
    private String nombreRol;
}
