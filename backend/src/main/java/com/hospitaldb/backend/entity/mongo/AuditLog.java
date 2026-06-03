package com.hospitaldb.backend.entity.mongo;

import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Document(collection = "audit_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    private String id;

    private Instant timestamp;

    private String action; // CREATE, UPDATE, DELETE, RESTORE, LOGIN

    private String entityType; // User, Paciente, Rol, etc.

    private String entityId;

    private AuditUser user;

    private AuditSource source;

    private AuditChange change;

    private Map<String, AuditDiff> diff;

    private String reason;

    private AuditMetadata metadata;

    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
        if (this.timestamp == null) {
            this.timestamp = Instant.now();
        }
    }

    // Clases internas
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditUser {
        private String id;
        private String username;
        private String email;
        private List<String> roles;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditSource {
        private String ip;
        private String userAgent;
        private String application;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditChange {
        private Object before;
        private Object after;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditDiff {
        private Object oldValue;
        private Object newValue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditMetadata {
        private String requestId;
        private String correlationId;
        private String transactionId;
    }
}
