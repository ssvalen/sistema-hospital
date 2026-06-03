package com.hospitaldb.backend.dto.response.clinico;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
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