package com.hospitaldb.backend.dto.response.clinico;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicamentoAsignadoDTO {
    private Long id;
    private Long idMedicamento;
    private String nombreComercial;
    private String principioActivo;
    private String dosis;
    private Integer cantidad;
    private String unidadMedida;
}