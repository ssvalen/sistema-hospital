package com.hospitaldb.backend.dto.response.inventario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BodegaDTO {
    private Long idBodega;
    private String nombreBodega;
    private String ubicacion;
    private Integer cantidadProductos;
}