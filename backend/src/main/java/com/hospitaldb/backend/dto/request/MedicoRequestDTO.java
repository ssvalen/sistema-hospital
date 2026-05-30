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
public class MedicoRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotBlank(message = "La especialidad es obligatoria")
    private String especialidad;

    @Pattern(regexp = "^[0-9]{8,15}$", message = "El teléfono debe tener entre 8 y 15 dígitos")
    private String telefono;

    @Email(message = "El email debe ser válido")
    private String email;
}
