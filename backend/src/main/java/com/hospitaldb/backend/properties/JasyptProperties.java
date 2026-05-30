package com.hospitaldb.backend.properties;

import jakarta.validation.Valid;
import lombok.Data;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Valid
@Component
@ConfigurationProperties(prefix = "jasypt.encryptor")
@Data
public class JasyptProperties {

    private String password;

    private String algorithm;

    private String keyObtentionIterations;

    private String poolSize;

    private String providerName;

    private String saltGeneratorClassname;

    private String ivGeneratorClassname;

    private String stringOutputType;
}
