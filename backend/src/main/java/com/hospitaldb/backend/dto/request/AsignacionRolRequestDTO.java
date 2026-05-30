package com.hospitaldb.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AsignacionRolRequestDTO {
    @NotNull(message = "El ID del usuario es obligatorio")
    @Positive(message = "El ID del usuario debe ser positivo")
    private Long idUsuario;

    @NotNull(message = "El ID del rol es obligatorio")
    @Positive(message = "El ID del rol debe ser positivo")
    private Long idRol;
}
