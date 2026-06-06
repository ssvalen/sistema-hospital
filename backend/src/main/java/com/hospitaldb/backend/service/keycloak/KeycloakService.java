package com.hospitaldb.backend.service.keycloak;

import com.hospitaldb.backend.dto.request.KeycloakUserRequestDTO;
import com.hospitaldb.backend.dto.response.keycloak.KeycloakRoleResponseDTO;
import com.hospitaldb.backend.dto.response.keycloak.KeycloakTokenResponse;
import com.hospitaldb.backend.dto.response.keycloak.KeycloakUserResponseDTO;
import com.hospitaldb.backend.exception.KeycloakException;
import com.hospitaldb.backend.properties.KeycloakAdminProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

import static com.hospitaldb.backend.utils.AppUtils.validNull;

@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakService {

        private final KeycloakAdminProperties keycloakAdminProperties;

        private final WebClient keycloakWebClient;

    private Mono<String> getAdminToken() {
        return keycloakWebClient.post()
                .uri("/realms/" + keycloakAdminProperties.getRealm() + "/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue("grant_type=password" +
                        "&client_id=" + keycloakAdminProperties.getClientId() +
                        "&username=" + keycloakAdminProperties.getUser() +
                        "&password=" + keycloakAdminProperties.getPassword())
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        response.bodyToMono(String.class)
                                .flatMap(error -> Mono.error(
                                        new RuntimeException("Error obteniendo token admin: " + error))))
                .bodyToMono(KeycloakTokenResponse.class)  // ← DTO en lugar de JsonNode
                .map(KeycloakTokenResponse::getAccessToken)
                .retryWhen(reactor.util.retry.Retry.backoff(10, java.time.Duration.ofSeconds(3)))
                .doOnError(e -> log.error("Error obteniendo token de admin: {}", e.getMessage()));
                
    }

        public Mono<Void> createUser(KeycloakUserRequestDTO request) {
                return getAdminToken()
                                .flatMap(token -> keycloakWebClient.post()
                                                .uri("/admin/realms/" + keycloakAdminProperties.getTargetRealm()
                                                                + "/users")
                                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .bodyValue(buildUserBody(request))
                                                .retrieve()
                                                .onStatus(HttpStatusCode::isError,
                                                                response -> response.bodyToMono(String.class)
                                                                                .flatMap(errorBody -> {
                                                                                        log.error("Error de Keycloak al crear el usuario: {}",
                                                                                                        errorBody);
                                                                                        String errorMessage = extractErrorMessage(
                                                                                                        errorBody);
                                                                                        return Mono.error(
                                                                                                        new KeycloakException(
                                                                                                                        errorMessage,
                                                                                                                        response.statusCode()
                                                                                                                                        .value(),
                                                                                                                        errorBody));
                                                                                }))
                                                .toBodilessEntity()
                                                .then())
                                .doOnSuccess(v -> log.info("Usuario {} creado en Keycloak", request.getUsername()))
                                .doOnError(e -> log.error("Error creando usuario {}: {}",
                                                request.getUsername(), e.getMessage()));
        }

        private Map<String, Object> buildUserBody(KeycloakUserRequestDTO request) {
                return Map.of(
                                "username", validNull(request.getUsername()),
                                "firstName", validNull(request.getFirstName()),
                                "lastName", validNull(request.getLastName()),
                                "email", validNull(request.getEmail()),
                                "emailVerified", false,
                                "enabled", request.getEnabled(),
                                "credentials", List.of(Map.of(
                                                "type", "password",
                                                "value", request.getPassword(),
                                                "temporary", false)));
        }

        public Mono<Void> assignRole(String userId, String roleName) {
                return getAdminToken()
                                .flatMap(token -> getRoleByName(token, roleName)
                                                .flatMap(role -> keycloakWebClient.post()
                                                                .uri("/admin/realms/"
                                                                                + keycloakAdminProperties
                                                                                                .getTargetRealm()
                                                                                +
                                                                                "/users/" + userId
                                                                                + "/role-mappings/realm")
                                                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                .bodyValue(List.of(role))
                                                                .retrieve()
                                                                .onStatus(HttpStatusCode::isError,
                                                                                response -> response.bodyToMono(
                                                                                                String.class)
                                                                                                .flatMap(errorBody -> {
                                                                                                        log.error("Error de Keycloak al asignar rol: {}",
                                                                                                                        errorBody);
                                                                                                        String errorMessage = extractErrorMessage(
                                                                                                                        errorBody);
                                                                                                        return Mono.error(
                                                                                                                        new KeycloakException(
                                                                                                                                        errorMessage,
                                                                                                                                        response.statusCode()
                                                                                                                                                        .value(),
                                                                                                                                        errorBody));
                                                                                                }))
                                                                .toBodilessEntity()
                                                                .then()))
                                .doOnSuccess(v -> log.info("Rol {} asignado al usuario {}", roleName, userId))
                                .doOnError(e -> log.error("Error asignando rol {} al usuario {}: {}", roleName, userId,
                                                e.getMessage()));
        }

        private String extractErrorMessage(String errorBody) {
                try {
                        if (errorBody.contains("errorMessage")) {
                                int start = errorBody.indexOf("\"errorMessage\":\"") + 16;
                                int end = errorBody.indexOf("\"", start);
                                if (start > 16 && end > start) {
                                        return errorBody.substring(start, end);
                                }
                        }
                } catch (Exception e) {
                        log.warn("No se pudo extraer mensaje de error del cuerpo: {}", errorBody);
                }
                return errorBody;
        }

        public String getUserId(String username) {
                return getAdminToken()
                                .flatMap(token -> keycloakWebClient.get()
                                                .uri("/admin/realms/" + keycloakAdminProperties.getTargetRealm()
                                                                + "/users?username=" + username)
                                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                                .retrieve()
                                                .bodyToFlux(KeycloakUserResponseDTO.class) // ← DTO
                                                .next()
                                                .map(KeycloakUserResponseDTO::getId))
                                .block();
        }

        private Mono<Map<String, Object>> getRoleByName(String token, String roleName) {
                return keycloakWebClient.get()
                                .uri("/admin/realms/" + keycloakAdminProperties.getTargetRealm() + "/roles/" + roleName)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .retrieve()
                                .bodyToMono(KeycloakRoleResponseDTO.class) // ← DTO
                                .map(role -> Map.of(
                                                "id", role.getId(),
                                                "name", role.getName()));
        }

        public Mono<Void> createRealmRole(String roleName) {
                return getAdminToken()
                                .flatMap(token -> keycloakWebClient.post()
                                                .uri("/admin/realms/" + keycloakAdminProperties.getTargetRealm()
                                                                + "/roles")
                                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .bodyValue(Map.of("name", roleName))
                                                .retrieve()
                                                .onStatus(HttpStatusCode::isError, response -> response
                                                                .bodyToMono(String.class)
                                                                .flatMap(error -> Mono.error(
                                                                                new RuntimeException(
                                                                                                "Error creando rol en Keycloak: "
                                                                                                                + error))))
                                                .toBodilessEntity()
                                                .then())
                                .doOnSuccess(v -> log.info("Rol {} creado en Keycloak", roleName))
                                .doOnError(e -> log.error("Error creando rol {}: {}", roleName, e.getMessage()));
        }

}
