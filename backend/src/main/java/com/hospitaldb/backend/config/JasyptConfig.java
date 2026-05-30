package com.hospitaldb.backend.config;

import com.hospitaldb.backend.properties.JasyptProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class JasyptConfig {

    private final JasyptProperties jasyptProperties;

    private SimpleStringPBEConfig createPBEConfig() {
        log.info("Propiedades de jasypt: {}",jasyptProperties.toString());
        String cleanPassword = jasyptProperties.getPassword()
                .trim()
                .replace("\n", "")
                .replace("\r", "");
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();
        config.setPassword(cleanPassword);
        config.setAlgorithm(jasyptProperties.getAlgorithm());
        config.setKeyObtentionIterations(jasyptProperties.getKeyObtentionIterations());
        config.setPoolSize(jasyptProperties.getPoolSize());
        config.setProviderName(jasyptProperties.getProviderName());
        config.setSaltGeneratorClassName(jasyptProperties.getSaltGeneratorClassname());
        config.setIvGeneratorClassName(jasyptProperties.getIvGeneratorClassname());
        config.setStringOutputType("hexadecimal");
        return config;
    }

    @Bean("jasyptStringEncryptor")
    @Primary
    public StringEncryptor stringEncryptor() {
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        encryptor.setConfig(createPBEConfig());
        return encryptor;
    }

//    @Bean("jasyptStringDecryptor")
//    public StringEncryptor stringDecryptor() {
//        // Jasypt usa el mismo objeto para cifrar y descifrar
//        PooledPBEStringEncryptor decryptor = new PooledPBEStringEncryptor();
//        decryptor.setConfig(createPBEConfig());
//        return decryptor;
//    }

    @Bean("jasyptCryptoService")
    public JasyptCryptoService jasyptCryptoService() {
        return new JasyptCryptoService(stringEncryptor());
    }

}
