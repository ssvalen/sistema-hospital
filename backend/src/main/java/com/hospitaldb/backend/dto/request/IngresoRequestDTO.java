package com.hospitaldb.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngresoRequestDTO {

    @NotNull(message = "El paciente es requerido")
    private Long idPaciente;

    @NotNull(message = "El área es requerida")
    private Long idArea;

    @NotBlank(message = "El motivo de ingreso es requerido")
    private String motivoIngreso;

    private String observaciones;
}
