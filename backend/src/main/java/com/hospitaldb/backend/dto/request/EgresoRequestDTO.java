package com.hospitaldb.backend.dto.request;

import com.hospitaldb.backend.enums.EstadoIngreso;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EgresoRequestDTO {

    @NotBlank(message = "El motivo de egreso es requerido")
    private String motivoEgreso;

    @NotNull(message = "El estado es requerido")
    private EstadoIngreso estado;

    private String observaciones;
}