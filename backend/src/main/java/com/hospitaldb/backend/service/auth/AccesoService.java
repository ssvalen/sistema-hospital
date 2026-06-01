package com.hospitaldb.backend.service.auth;

import com.hospitaldb.backend.repository.administrativo.IUsuarioRolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccesoService {

    private final IUsuarioRolRepository usuarioRolRepository;

    private String getKeycloakId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getToken().getSubject();
        }
        throw new RuntimeException("No hay usuario autenticado");
    }

    public List<Long> getRolesPadreUsuarioActual() {
        return usuarioRolRepository.findIdRolesPadreByKeycloakId(getKeycloakId());
    }

    public void verificarRolPadre(Long... idRolesPadrePermitidos) {
        List<Long> rolesUsuario = getRolesPadreUsuarioActual();

        boolean tieneAcceso = Arrays.stream(idRolesPadrePermitidos)
                .anyMatch(rolesUsuario::contains);

        if (!tieneAcceso) {
            throw new AccessDeniedException(
                    "No tienes el rol necesario para esta acción");
        }
    }
}
