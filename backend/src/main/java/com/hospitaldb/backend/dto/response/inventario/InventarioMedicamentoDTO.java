package com.hospitaldb.backend.dto.response.inventario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventarioMedicamentoDTO {
    private Long idInventario;
    private Long idMedicamento;
    private String medicamentoNombre;
    private String medicamentoPrincipioActivo;
    private Long idBodega;
    private String bodegaNombre;
    private Integer stockActual;
    private Integer stockMinimo;
    private String unidadMedida;
    private Boolean necesitaReposicion;
}
