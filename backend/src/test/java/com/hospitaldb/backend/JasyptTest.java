package com.hospitaldb.backend;

import org.jasypt.encryption.StringEncryptor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class JasyptTest {
    @Autowired
    @Qualifier("jasyptStringEncryptor")
    private StringEncryptor encryptor;

    @Test
    void testEncryptDecrypt() {
        String original = "Ncub+l5wZyDhAdc99QM/YEXpKxcOlJ33s3ityN72Yr0Mzhg10IGDCvE/rRdP1mvSe/t1JV9iuNWuCpO13983PQ==";
        String decrypted = encryptor.decrypt(original);

        assertEquals(original, decrypted);
    }
}
