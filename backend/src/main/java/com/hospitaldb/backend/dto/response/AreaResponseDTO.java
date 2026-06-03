package com.hospitaldb.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaResponseDTO {
    private Long idArea;
    private String nombreArea;
    private String descripcion;
    private Integer capacidad;
    private Boolean activo;
    private String fechaCreacion;
    private String fechaModificacion;
}
