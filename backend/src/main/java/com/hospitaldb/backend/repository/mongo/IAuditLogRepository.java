package com.hospitaldb.backend.repository.mongo;

import com.hospitaldb.backend.entity.mongo.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findByEntityTypeAndEntityId(String entityType, String entityId);

    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId);

    List<AuditLog> findByActionAndEntityType(String action, String entityType);
}
