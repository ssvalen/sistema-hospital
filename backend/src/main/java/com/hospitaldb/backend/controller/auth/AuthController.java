package com.hospitaldb.backend.controller.auth;

import com.hospitaldb.backend.dto.request.auth.LoginRequestDTO;
import com.hospitaldb.backend.dto.response.EntityResponse;
import com.hospitaldb.backend.dto.response.auth.LoginResponseDTO;
import com.hospitaldb.backend.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hospitaldb/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<EntityResponse<LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO requestDTO,
            HttpServletRequest request) {

        log.info("POST /api/auth/login - Intento de login para usuario: {}", requestDTO.getUsername());

        LoginResponseDTO response = authService.login(requestDTO);

        return ResponseEntity.ok(
                EntityResponse.success(response, "Login exitoso", request.getRequestURI())
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<EntityResponse<LoginResponseDTO>> refresh(
            @RequestParam String refreshToken,
            HttpServletRequest request) {

        log.info("POST /api/auth/refresh - Refrescando token");

        LoginResponseDTO response = authService.refreshToken(refreshToken);

        return ResponseEntity.ok(
                EntityResponse.success(response, "Token refrescado exitosamente", request.getRequestURI())
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<EntityResponse<Void>> logout(
            @RequestParam String refreshToken,
            HttpServletRequest request) {

        log.info("POST /api/auth/logout - Cerrando sesión");

        authService.logout(refreshToken);

        return ResponseEntity.ok(
                EntityResponse.success(null, "Sesión cerrada exitosamente", request.getRequestURI())
        );
    }
}