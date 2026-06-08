import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export type AuditLogResponseDTO = {
    id: string; 
    timestamp: string;
    action: string;
    entityType: string;
    entityId: string;
    reason?: string;

    user: {
        id: string;
        username: string;
        email: string;
        roles: string[];
    };

    source: {
        ip: string;
        userAgent: string;
        application: string;
    };

    change: {
        before: unknown;
        after: unknown;
    };

    diff?: Record<string, {
        oldValue: unknown;
        newValue: unknown;
    }>;

    metadata?: {
        requestId?: string;
        correlationId?: string;
    };
};

export type PaginatedAuditLogsDTO = PaginatedResponse<AuditLogResponseDTO>;