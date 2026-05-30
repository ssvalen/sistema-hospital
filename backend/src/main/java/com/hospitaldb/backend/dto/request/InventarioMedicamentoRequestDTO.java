package com.hospitaldb.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventarioMedicamentoRequestDTO {
    @NotNull(message = "El ID del medicamento es obligatorio")
    @Positive(message = "El ID del medicamento debe ser positivo")
    private Long idMedicamento;

    @NotNull(message = "El ID de la bodega es obligatorio")
    @Positive(message = "El ID de la bodega debe ser positivo")
    private Long idBodega;

    @PositiveOrZero(message = "El stock actual debe ser mayor o igual a 0")
    private Integer stockActual;

    @PositiveOrZero(message = "El stock mínimo debe ser mayor o igual a 0")
    private Integer stockMinimo;

    @Size(max = 50, message = "La unidad de medida no puede exceder 50 caracteres")
    private String unidadMedida;
}
