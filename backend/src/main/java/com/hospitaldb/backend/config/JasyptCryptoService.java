package com.hospitaldb.backend.config;

import lombok.RequiredArgsConstructor;
import org.jasypt.encryption.StringEncryptor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JasyptCryptoService {
    private final StringEncryptor stringEncryptor;

    public String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return plainText;
        }
        return "ENC(" + stringEncryptor.encrypt(plainText) + ")";
    }


    public String decrypt(String encryptedText) {
        if (encryptedText == null || encryptedText.isEmpty()) {
            return encryptedText;
        }

        String valueToDecrypt = encryptedText;

        if (encryptedText.startsWith("ENC(") && encryptedText.endsWith(")")) {
            valueToDecrypt = encryptedText.substring(4, encryptedText.length() - 1);
        }

        try {
            return stringEncryptor.decrypt(valueToDecrypt);
        } catch (Exception e) {
            throw new RuntimeException("Error al descifrar el texto", e);
        }
    }

    public boolean isEncrypted(String text) {
        return text != null && text.startsWith("ENC(") && text.endsWith(")");
    }
}
