package com.hospitaldb.backend.dto.response.clinico;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoDTO {
    private Long idTratamiento;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    // Información de la cita
    private Long idCita;
    private String citaFechaHora;
    private String citaEstado;

    // Información del paciente
    private Long idPaciente;
    private String pacienteNombre;
    private String pacienteApellido;
    private String pacienteTelefono;

    // Información del médico
    private Long idMedico;
    private String medicoNombre;
    private String medicoApellido;
    private String medicoEspecialidad;

    // Medicamentos asociados
    private List<MedicamentoAsignadoDTO> medicamentos;
}