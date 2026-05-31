package com.hospitaldb.backend.controller.keycloak;

import com.hospitaldb.backend.dto.response.keycloak.KeycloakUserResponseDTO;
import com.hospitaldb.backend.service.keycloak.KeycloakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/hospitaldb/keycloak")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class KeycloakController {
    private final KeycloakService keycloakService;

    @GetMapping("/users")
    public ResponseEntity<String> getUserByUsername(@RequestParam String username){
        return ResponseEntity.ok(keycloakService.getUserId(username));
    }
}
