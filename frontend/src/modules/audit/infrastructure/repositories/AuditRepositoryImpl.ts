import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";


import type { AuditRepository } from "../../application/interfaces/AuditRepository";
import {
    paginatedAuditLogsToDomain,
    auditLogsToDomain
} from "../mappers/auditLogMapper";
import type {
    AuditLogResponseDTO,
    PaginatedAuditLogsDTO
} from "../../domain/dto/AuditDTO";

import { API_ROUTES } from "@/shared/utils/apiRoutes";


export function createAuditRepository(http: HttpClient): AuditRepository {
    return {
        async getAuditLogs(signal) {
            const dto = await http.request<ApiResponse<AuditLogResponseDTO[]>>({
                url: API_ROUTES.AUDIT_ENDPOINT,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return auditLogsToDomain(dto.data);
        },
        async getAuditLogsPaginated(page, size, signal) {
            const dto = await http.request<ApiResponse<PaginatedAuditLogsDTO>>({
                url: `${API_ROUTES.AUDIT_ENDPOINT}?page=${page}&size=${size}`,
                method: "GET",
                signal,
            });

            return paginatedAuditLogsToDomain(dto.data);
        },

    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const auditRepository: AuditRepository =
    createAuditRepository(httpClient);