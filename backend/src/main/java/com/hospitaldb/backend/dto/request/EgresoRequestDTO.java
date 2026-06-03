package com.hospitaldb.backend.dto.request;

import com.hospitaldb.backend.enums.EstadoIngreso;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EgresoRequestDTO {

    @NotBlank(message = "El motivo de egreso es requerido")
    private String motivoEgreso;

    @NotBlank(message = "El estado es requerido")
    private EstadoIngreso estado;

    private String observaciones;
}