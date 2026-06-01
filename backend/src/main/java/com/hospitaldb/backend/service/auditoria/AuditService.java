package com.hospitaldb.backend.service.auditoria;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospitaldb.backend.entity.mongo.AuditLog;
import com.hospitaldb.backend.repository.mongo.IAuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final IAuditLogRepository auditLogRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper jacksonMapper =
            new com.fasterxml.jackson.databind.ObjectMapper();


    public void log(String action,
                    String entityType,
                    String entityId,
                    String before,
                    String after,
                    String reason,
                    HttpServletRequest request) {

        try {


            AuditLog auditLog = AuditLog.builder()
                    .timestamp(Instant.now())
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .user(buildUser())
                    .source(buildSource(request))
                    .change(AuditLog.AuditChange.builder()
                            .before(before)
                            .after(after)
                            .build())
                    .diff(buildDiff(before, after))
                    .reason(reason)
                    .metadata(buildMetadata(request))
                    .build();

            auditLogRepository.save(auditLog);
            log.info("Audit log guardado: {} - {} - {}", action, entityType, entityId);

        } catch (Exception e) {
            // El log nunca debe interrumpir el flujo principal
            log.error("Error guardando audit log: {}", e.getMessage());
        }
    }

    private Object sanitize(Object obj) {
        if (obj == null) return null;
        try {
            String json = jacksonMapper.writeValueAsString(obj);
            return jacksonMapper.readValue(json,
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
        } catch (Exception e) {
            log.warn("No se pudo sanitizar objeto para audit: {}", e.getMessage());
            return obj.toString();
        }
    }

    private AuditLog.AuditUser buildUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth instanceof JwtAuthenticationToken jwtAuth) {
                Jwt jwt = jwtAuth.getToken();
                Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
                List<String> roles = realmAccess != null
                        ? (List<String>) realmAccess.get("roles")
                        : List.of();

                return AuditLog.AuditUser.builder()
                        .id(jwt.getSubject())
                        .username(jwt.getClaimAsString("preferred_username"))
                        .email(jwt.getClaimAsString("email"))
                        .roles(roles)
                        .build();
            }
        } catch (Exception e) {
            log.warn("No se pudo obtener usuario del token: {}", e.getMessage());
        }
        return AuditLog.AuditUser.builder()
                .id("system")
                .username("system")
                .build();
    }

    private AuditLog.AuditSource buildSource(HttpServletRequest request) {
        if (request == null) return null;
        return AuditLog.AuditSource.builder()
                .ip(getClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .application("api-hospital-db")
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private AuditLog.AuditMetadata buildMetadata(HttpServletRequest request) {
        return AuditLog.AuditMetadata.builder()
                .requestId(request != null ? request.getHeader("X-Request-ID") : null)
                .correlationId(request != null ? request.getHeader("X-Correlation-ID") : null)
                .build();
    }

    // Genera diff entre before y after
    private Map<String, AuditLog.AuditDiff> buildDiff(Object before, Object after) {
        if (before == null || after == null) return null;

        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> beforeMap = mapper.convertValue(before,
                    new TypeReference<Map<String, Object>>() {});
            Map<String, Object> afterMap = mapper.convertValue(after,
                    new TypeReference<Map<String, Object>>() {});

            Map<String, AuditLog.AuditDiff> diff = new LinkedHashMap<>();
            afterMap.forEach((key, newVal) -> {
                Object oldVal = beforeMap.get(key);
                if (!Objects.equals(oldVal, newVal)) {
                    diff.put(key, AuditLog.AuditDiff.builder()
                            .oldValue(oldVal)
                            .newValue(newVal)
                            .build());
                }
            });
            return diff.isEmpty() ? null : diff;

        } catch (Exception e) {
            log.warn("No se pudo generar diff: {}", e.getMessage());
            return null;
        }
    }
}
