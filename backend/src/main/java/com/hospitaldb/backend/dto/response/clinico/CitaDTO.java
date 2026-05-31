package com.hospitaldb.backend.dto.response.clinico;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitaDTO {
    private Long idCita;
    private LocalDateTime fechaHora;
    private String estado;
    private Long idPaciente;
    private String pacienteNombre;
    private String pacienteApellido;
    private Long idMedico;
    private String medicoNombre;
    private String medicoApellido;
    private String medicoEspecialidad;
}