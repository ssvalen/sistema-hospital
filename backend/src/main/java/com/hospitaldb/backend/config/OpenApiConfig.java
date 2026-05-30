package com.hospitaldb.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
    @Value("${server.port}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Hospital DB - Sistema de Gestión Hospitalaria")
                        .description("""
                                API RESTful para la gestión completa de un sistema hospitalario.
                                
                                ## Características principales:
                                * Gestión de pacientes, médicos y citas
                                * Control de tratamientos y medicamentos
                                * Inventario de medicamentos por bodega
                                * Administración de usuarios y roles (RBAC)
                                * Seguridad integrada con Keycloak (JWT)
                                
                                ## Autenticación:
                                Esta API utiliza OAuth2 con Keycloak. Para probar los endpoints:
                                1. Obtén un token desde Keycloak
                                2. Usa el botón "Authorize" en Swagger UI
                                3. Ingresa el token en formato: `Bearer {tu-token}`
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Sistema Hospitalario - Equipo de Desarrollo")
                                .email("soporte@hospitaldb.com")
                                .url("https://github.com/hospital-db"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:" + serverPort)
                                .description("Servidor Local (Desarrollo)"),
                        new Server().url("https://api.hospitaldb.com")
                                .description("Servidor de Producción")
                ))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("""
                                                Ingresa tu token JWT obtenido de Keycloak.
                                                
                                                Formato: `Bearer eyJhbGciOiJSUzI1NiIs...`
                                                """)));
    }

    /**
     * Grupo: APIs Administrativas
     * Incluye: usuarios, roles, permisos, crypto
     */
    @Bean
    public GroupedOpenApi administrativoApi() {
        return GroupedOpenApi.builder()
                .group("01 - Administrativo")
                .displayName("Gestión Administrativa")
                .pathsToMatch("/api/hospitaldb/administrativo/**")
                .addOpenApiCustomizer(openApi -> {
                    openApi.getInfo().setDescription("""
                            Endpoints para la gestión administrativa del sistema.
                            
                            ### Módulos incluidos:
                            - **Usuarios**: CRUD de usuarios del sistema
                            - **Roles**: Gestión de roles y permisos
                            - **Permisos**: Definición de permisos granulares
                            - **Crypto**: Utilidades de cifrado (solo desarrollo)
                            """);
                })
                .build();
    }

    /**
     * Grupo: APIs Clínicas
     * Incluye: pacientes, médicos, citas, tratamientos
     */
    @Bean
    public GroupedOpenApi clinicoApi() {
        return GroupedOpenApi.builder()
                .group("02 - Clínico")
                .displayName("Gestión Clínica")
                .pathsToMatch("/api/hospitaldb/clinico/**")
                .addOpenApiCustomizer(openApi -> {
                    openApi.getInfo().setDescription("""
                            Endpoints para la gestión clínica del hospital.
                            
                            ### Módulos incluidos:
                            - **Pacientes**: CRUD y búsqueda de pacientes
                            - **Médicos**: Gestión de médicos y especialidades
                            - **Citas**: Agendamiento y cancelación de citas
                            - **Tratamientos**: Registro de tratamientos médicos
                            """);
                })
                .build();
    }

    /**
     * Grupo: APIs de Medicamentos
     * Incluye: medicamentos, relación tratamiento-medicamento
     */
    @Bean
    public GroupedOpenApi medicamentosApi() {
        return GroupedOpenApi.builder()
                .group("03 - Medicamentos")
                .displayName("Gestión de Medicamentos")
                .pathsToMatch("/api/hospitaldb/medicamentos/**")
                .addOpenApiCustomizer(openApi -> {
                    openApi.getInfo().setDescription("""
                            Endpoints para la gestión del catálogo de medicamentos.
                            
                            ### Módulos incluidos:
                            - **Medicamentos**: CRUD de medicamentos
                            - **Tratamiento-Medicamento**: Asignación de medicamentos a tratamientos
                            """);
                })
                .build();
    }

    /**
     * Grupo: APIs de Inventario
     * Incluye: bodegas, inventario de medicamentos
     */
    @Bean
    public GroupedOpenApi inventarioApi() {
        return GroupedOpenApi.builder()
                .group("04 - Inventario")
                .displayName("Gestión de Inventario")
                .pathsToMatch("/api/hospitaldb/inventario/**")
                .addOpenApiCustomizer(openApi -> {
                    openApi.getInfo().setDescription("""
                            Endpoints para la gestión de inventario de medicamentos.
                            
                            ### Módulos incluidos:
                            - **Bodegas**: CRUD de bodegas de almacenamiento
                            - **Inventario**: Control de stock de medicamentos
                            """);
                })
                .build();
    }
}
