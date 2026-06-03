package com.hospitaldb.backend.dto.response;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngresoEgresoResponseDTO {

    private Long idIngreso;

    // Datos del paciente
    private Long idPaciente;
    private String nombrePaciente;
    private String apellidoPaciente;

    // Datos del área
    private Long idArea;
    private String nombreArea;

    private String fechaIngreso;
    private String fechaEgreso;
    private String motivoIngreso;
    private String motivoEgreso;
    private String estado;
    private String observaciones;
    private Boolean activo;
    private String fechaCreacion;
}
