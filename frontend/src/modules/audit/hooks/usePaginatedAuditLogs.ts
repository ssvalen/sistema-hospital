import { usePaginatedTable } from "@/shared/hooks/usePaginatedTable";
import { auditRepository } from "../infrastructure/repositories/AuditRepositoryImpl";
import type { AuditLog } from "../domain/entities/AuditLog";


export const usePaginatedAuditLogs = (page: number, size: number) => {
  return usePaginatedTable<AuditLog>(
    "AuditLogs",
    page,
    size,
    ({ page, size, signal }) =>
      auditRepository.getAuditLogsPaginated(page, size, signal)
  );
};