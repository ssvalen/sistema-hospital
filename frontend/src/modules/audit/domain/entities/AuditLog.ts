import type { AuditAction, AuditDiffMap } from "../../types/AuditTypes";
export type AuditLog = {
    id: number;
    timestamp: string;
    action: AuditAction;
    entityType: string;
    entityId: number;
    reason?: string;

    user: {
        id: number;
        username: string;
        email: string;
        roles: string[];
    };

    source: {
        ip: string;
        userAgent: string;
        application: string;
    },
    changes: {
        before: {};
        after: {};
    }
    fieldDiff?: AuditDiffMap;
    metaData?: {
        requestId: string;
        correlationId: string;
    }

}