package com.hospitaldb.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class MongoDebugConfig {

    @Value("${spring.data.mongodb.uri:NO_URI_FOUND}")
    private String mongoUri;

    @Bean
    public CommandLineRunner mongoDebug() {
        return args -> {
            log.info("=== MONGO URI: {}", mongoUri);
        };
    }
}
