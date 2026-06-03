package com.hospitaldb.backend.service.auditoria;

import com.hospitaldb.backend.entity.mongo.AuditLog;
import com.hospitaldb.backend.exception.BusinessException;
import com.hospitaldb.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final MongoTemplate mongoTemplate;

    @Transactional(readOnly = true)
    public List<AuditLog> findAll() {
        log.info("Obteniendo todos los audit logs");
        return auditLogRepository.findAll();
    }

    public Page<AuditLog> findAllPaginado(int page, int size, String sortBy, String sortDir) {
        log.info("Obteniendo audit logs paginados - página: {}, tamaño: {}", page, size);
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return auditLogRepository.findAll(pageable);
    }

    public AuditLog findById(String id) {
        log.info("Buscando audit log por id: {}", id);
        return auditLogRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "No existe el audit log con id: " + id));
    }

    public List<AuditLog> findByFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        log.info("Buscando audit logs por fecha: {}", fechaInicio);

        Instant inicioDia = fechaInicio.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant finDia;
        if(Objects.isNull(fechaFin))
            finDia = fechaInicio.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        else
            finDia = fechaFin.atStartOfDay(ZoneOffset.UTC).toInstant();

        Query query = new Query(
                Criteria.where("timestamp")
                        .gte(inicioDia)
                        .lt(finDia)
        );
        query.with(Sort.by(Sort.Direction.DESC, "timestamp"));

        return mongoTemplate.find(query, AuditLog.class);
    }
}
