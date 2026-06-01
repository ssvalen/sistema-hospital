package com.hospitaldb.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AsignacionPermisoRequestDTO {
    @NotNull(message = "El ID del rol es obligatorio")
    @Positive(message = "El ID del rol debe ser positivo")
    private Long idRol;

    @NotNull(message = "El ID de los permisos son obligatorios")
    @Positive(message = "El ID de los permisos deben de ser positivos")
    @Singular
    private List<Long> idPermisos;
}
