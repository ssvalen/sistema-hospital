package com.hospitaldb.backend.controller.administrativo;

import com.hospitaldb.backend.config.JasyptCryptoService;
import com.hospitaldb.backend.dto.response.EntityResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Profile("dev")
@RestController
@RequestMapping("/api/hoteldb/administrativo/crypto")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CryptoController {
    private final JasyptCryptoService cryptoService;

    @PostMapping("/encrypt")
    public ResponseEntity<EntityResponse<Map<String, String>>> encrypt(
            @RequestParam String plainText,
            HttpServletRequest request
    ) {


        log.info("POST /api/crypto/encrypt - Cifrando texto");

        String encrypted = cryptoService.encrypt(plainText);

        Map<String, String> response = new HashMap<>();
        response.put("plainText", plainText);
        response.put("encrypted", encrypted);

        return ResponseEntity.ok(
                EntityResponse.success(response, "Texto cifrado exitosamente", request.getRequestURI())
        );
    }

    @PostMapping("/decrypt")
    public ResponseEntity<EntityResponse<Map<String, String>>> decrypt(
            @RequestParam String encryptedText,
            HttpServletRequest request) {

        log.info("POST /api/crypto/decrypt - Descifrando texto");

        String decrypted = cryptoService.decrypt(encryptedText);

        Map<String, String> response = new HashMap<>();
        response.put("encrypted", encryptedText);
        response.put("decrypted", decrypted);

        return ResponseEntity.ok(
                EntityResponse.success(response, "Texto descifrado exitosamente", request.getRequestURI())
        );
    }

    @GetMapping("/check")
    public ResponseEntity<EntityResponse<Map<String, Object>>> check(
            @RequestParam String text,
            HttpServletRequest request) {

        boolean isEncrypted = cryptoService.isEncrypted(text);

        Map<String, Object> response = new HashMap<>();
        response.put("text", text);
        response.put("isEncrypted", isEncrypted);

        return ResponseEntity.ok(
                EntityResponse.success(response, "Verificación completada", request.getRequestURI())
        );
    }
}
