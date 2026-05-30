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
public class TratamientoMedicamentoRequestDTO {

    @NotNull(message = "El ID del tratamiento es obligatorio")
    @Positive(message = "El ID del tratamiento debe ser positivo")
    private Long idTratamiento;

    @NotNull(message = "El ID del medicamento es obligatorio")
    @Positive(message = "El ID del medicamento debe ser positivo")
    private Long idMedicamento;

    @Size(max = 100, message = "La dosis no puede exceder 100 caracteres")
    private String dosis;

    @Positive(message = "La cantidad debe ser positiva")
    private Integer cantidad;

}
