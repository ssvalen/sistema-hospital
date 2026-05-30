package com.hospitaldb.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jasypt.encryption.StringEncryptor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Slf4j
public class JasyptCryptoService {

    private final StringEncryptor stringEncryptor;

    public String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return plainText;
        }
        String normalized = new String(plainText.getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8);

        log.info("=== ENCRYPT ===");
        log.info("Input length: {}", plainText.length());
        log.info("Input bytes: {}", Arrays.toString(plainText.getBytes(StandardCharsets.UTF_8)));
        log.info("Encryptor instance: {}", System.identityHashCode(stringEncryptor));
        String result = stringEncryptor.encrypt(normalized);
        log.info("Encrypted result: {}", result);
        return "ENC(" + result + ")";
    }


    public String decrypt(String encryptedText) {
        if (encryptedText == null || encryptedText.isEmpty()) {
            return encryptedText;
        }

        String valueToDecrypt = encryptedText;
        if (encryptedText.startsWith("ENC(") && encryptedText.endsWith(")")) {
            valueToDecrypt = encryptedText.substring(4, encryptedText.length() - 1);
        }

        log.info("=== DECRYPT ===");
        log.info("Value to decrypt: {}", valueToDecrypt);
        log.info("Encryptor instance: {}", System.identityHashCode(stringEncryptor));

        try {
            String decrypted = stringEncryptor.decrypt(valueToDecrypt);
            return new String(decrypted.getBytes(StandardCharsets.UTF_8), StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Decrypt failed for value: {}", valueToDecrypt);
            throw new RuntimeException("Error al descifrar el texto", e);
        }
    }

    public boolean isEncrypted(String text) {
        return text != null && text.startsWith("ENC(") && text.endsWith(")");
    }
}
