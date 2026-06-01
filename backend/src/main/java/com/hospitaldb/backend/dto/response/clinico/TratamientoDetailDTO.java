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
public class TratamientoDetailDTO {
    private Long idTratamiento;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Long idCita;
    private String citaFechaHora;
    private Long idPaciente;
    private String pacienteNombre;
    private String pacienteApellido;
    private Long idMedico;
    private String medicoNombre;
    private String medicoApellido;
    private List<MedicamentoAsignadoDTO> medicamentos;
}