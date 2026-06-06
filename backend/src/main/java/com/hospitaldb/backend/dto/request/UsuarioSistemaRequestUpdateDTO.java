package com.hospitaldb.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSistemaRequestUpdateDTO {
    @NotBlank(message = "El username es obligatorio")
    @Size(min = 3, max = 100, message = "El username debe tener entre 3 y 100 caracteres")
    private String username;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    private String email;

    @Builder.Default
    private Boolean activo = true;
    
    @NotBlank(message = "El nombre del usuario es obligatorio")
    private String primerNombre;

    @NotBlank(message = "Los apellidos del usuario es obligatorio")
    private String apellidos;

    @NotEmpty(message = "La lista de permisos no puede estar vacía")
    private List<Long> idRolesHijo;
}
