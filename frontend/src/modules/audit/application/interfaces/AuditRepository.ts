import type { AuditLog } from "../../domain/entities/AuditLog";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export interface AuditRepository {
    getAuditLogs(signal?: AbortSignal): Promise<AuditLog[]>;
    getAuditLogsPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<AuditLog>>;
}