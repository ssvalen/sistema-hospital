package com.hospitaldb.backend.dto.response.medicamentos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoMedicamentoDTO {
    private Long id;
    private Long idTratamiento;
    private String tratamientoDescripcion;
    private Long idMedicamento;
    private String medicamentoNombre;
    private String medicamentoPrincipioActivo;
    private String dosis;
    private Integer cantidad;
}