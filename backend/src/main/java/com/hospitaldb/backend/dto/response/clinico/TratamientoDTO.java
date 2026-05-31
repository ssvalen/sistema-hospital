package com.hospitaldb.backend.dto.response.clinico;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoDTO {
    private Long idTratamiento;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long idCita;
}