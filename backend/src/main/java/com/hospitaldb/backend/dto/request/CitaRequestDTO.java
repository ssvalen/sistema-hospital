package com.hospitaldb.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitaRequestDTO {
    @NotNull(message = "La fecha y hora son obligatorias")
    @Future(message = "La cita debe ser en el futuro")
    private LocalDateTime fechaHora;

    private String estado;

    @NotNull(message = "El ID del paciente es obligatorio")
    @Positive(message = "El ID del paciente debe ser positivo")
    private Long idPaciente;

    @NotNull(message = "El ID del médico es obligatorio")
    @Positive(message = "El ID del médico debe ser positivo")
    private Long idMedico;

}
