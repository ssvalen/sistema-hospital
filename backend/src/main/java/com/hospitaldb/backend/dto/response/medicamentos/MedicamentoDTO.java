package com.hospitaldb.backend.dto.response.medicamentos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicamentoDTO {
    private Long idMedicamento;
    private String nombreComercial;
    private String principioActivo;
    private String unidadMedida;
    private Integer cantidadTratamientos;
    private Integer stockTotal;
}