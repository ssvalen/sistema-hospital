package com.hospitaldb.backend.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshRequestDTO {

    @NotBlank(message = "El refreshToken es obligatorio")
    private String refreshToken;

}