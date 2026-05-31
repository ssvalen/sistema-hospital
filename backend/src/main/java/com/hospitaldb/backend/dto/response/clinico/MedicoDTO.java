package com.hospitaldb.backend.dto.response.clinico;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicoDTO {
    private Long idMedico;
    private String nombre;
    private String apellido;
    private String especialidad;
    private String telefono;
    private String email;
    private Integer cantidadCitas;
}
