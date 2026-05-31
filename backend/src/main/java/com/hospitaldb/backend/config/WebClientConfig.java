package com.hospitaldb.backend.config;

import com.hospitaldb.backend.properties.KeycloakAdminProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@RequiredArgsConstructor
public class WebClientConfig {
    private final KeycloakAdminProperties keycloakAdminProperties;

    @Bean("keycloakWebClient")
    public WebClient keycloakWebClient() {
        return WebClient.builder()
                .baseUrl(keycloakAdminProperties.getServerUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE)
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(1024 * 1024)) // 1MB
                .build();
    }
}
