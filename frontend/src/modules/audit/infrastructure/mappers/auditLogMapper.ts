import type { AuditLog } from "../../domain/entities/AuditLog";
import type {
    AuditLogResponseDTO,
    PaginatedAuditLogsDTO
} from "../../domain/dto/AuditDTO";
import type { AuditAction } from "../../types/AuditTypes";
import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

export function auditLogToDomain(dto: AuditLogResponseDTO): AuditLog {

    return {
        id: Number(dto.id),
        timestamp: dto.timestamp,
        action: dto.action as AuditAction,
        entityType: dto.entityType,
        entityId: Number(dto.entityId),
        reason: dto.reason,

        user: {
            id: Number(dto.user.id),
            username: dto.user.username,
            email: dto.user.email,
            roles: dto.user.roles
        },

        source: {
            ip: dto.source.ip,
            userAgent: dto.source.userAgent,
            application: dto.source.application
        },

        changes: {
            before: dto.change?.before ?? {},
            after: dto.change?.after ?? {}
        },

        fieldDiff: dto.diff ?? undefined,

        metaData: dto.metadata
            ? {
                requestId: dto.metadata.requestId ?? "",
                correlationId: dto.metadata.correlationId ?? ""
            }
            : undefined
    };
};

export function auditLogsToDomain(dtos: AuditLogResponseDTO[]): AuditLog[] {
    return dtos.map(auditLogToDomain)
}

export function paginatedAuditLogsToDomain(dto: PaginatedAuditLogsDTO) {
    return paginatedMapper(dto, auditLogToDomain);
}