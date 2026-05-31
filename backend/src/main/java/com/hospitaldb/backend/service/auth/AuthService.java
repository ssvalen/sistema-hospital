package com.hospitaldb.backend.service.auth;

import com.hospitaldb.backend.dto.request.auth.LoginRequestDTO;
import com.hospitaldb.backend.dto.response.auth.LoginResponseDTO;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.properties.KeycloakAdminProperties;
import com.hospitaldb.backend.properties.KeycloakHospitalProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final RestTemplate restTemplate;

    private final KeycloakHospitalProperties keycloakHospitalProperties;

    private final KeycloakAdminProperties keycloakAdminProperties;


    public LoginResponseDTO login(LoginRequestDTO request) {
        log.info("Intentando autenticar usuario: {}", request.getUsername());

        String tokenUrl = String.format("%s/realms/%s/protocol/openid-connect/token",
                keycloakAdminProperties.getServerUrl(), keycloakHospitalProperties.getRealm());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id",keycloakAdminProperties.getClientId() );
        body.add("username", request.getUsername());
        body.add("password", request.getPassword());

        if (keycloakHospitalProperties.getClientSecret() != null && !keycloakHospitalProperties.getClientSecret().isEmpty()) {
            body.add("client_secret", keycloakHospitalProperties.getClientSecret());
        }

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<LoginResponseDTO> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    entity,
                    LoginResponseDTO.class
            );

            log.info("Usuario autenticado exitosamente: {}", request.getUsername());
            return response.getBody();

        } catch (HttpClientErrorException e) {
            log.error("Error al autenticar usuario: {}", e.getResponseBodyAsString());

            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new BusinessException("Credenciales inválidas. Verifica tu usuario y contraseña.");
            }

            throw new BusinessException("Error al autenticar: " + e.getMessage());
        }
    }

    public LoginResponseDTO refreshToken(String refreshToken) {
        log.info("Refrescando token");

        String tokenUrl = String.format("%s/realms/%s/protocol/openid-connect/token",
               keycloakAdminProperties.getServerUrl() , keycloakHospitalProperties.getRealm());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("client_id", keycloakAdminProperties.getClientId());
        body.add("refresh_token", refreshToken);

        if (keycloakHospitalProperties.getClientSecret() != null && !keycloakHospitalProperties.getClientSecret().isEmpty()) {
            body.add("client_secret", keycloakHospitalProperties.getClientSecret());
        }

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<LoginResponseDTO> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    entity,
                    LoginResponseDTO.class
            );

            log.info("Token refrescado exitosamente");
            return response.getBody();

        } catch (HttpClientErrorException e) {
            log.error("Error al refrescar token: {}", e.getResponseBodyAsString());
            throw new BusinessException("Error al refrescar token: " + e.getMessage());
        }
    }


    public void logout(String refreshToken) {
        log.info("Cerrando sesión");

        String logoutUrl = String.format("%s/realms/%s/protocol/openid-connect/logout",
                keycloakAdminProperties.getServerUrl(), keycloakHospitalProperties.getRealm());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", keycloakAdminProperties.getClientId());
        body.add("refresh_token", refreshToken);

        if (keycloakHospitalProperties.getClientSecret() != null && !keycloakHospitalProperties.getClientSecret().isEmpty()) {
            body.add("client_secret", keycloakHospitalProperties.getClientSecret());
        }

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(logoutUrl, entity, String.class);
            log.info("Sesión cerrada exitosamente");
        } catch (HttpClientErrorException e) {
            log.error("Error al cerrar sesión: {}", e.getResponseBodyAsString());
        }
    }
}