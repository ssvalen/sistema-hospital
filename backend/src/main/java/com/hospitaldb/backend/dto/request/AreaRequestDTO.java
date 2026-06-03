package com.hospitaldb.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// REQUEST
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AreaRequestDTO {

    @NotBlank(message = "El nombre del área es requerido")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombreArea;

    @Size(max = 200, message = "La descripción no puede exceder 200 caracteres")
    private String descripcion;

    @Min(value = 1, message = "La capacidad debe ser mayor a 0")
    private Integer capacidad;

    private Boolean activo = true;
}
