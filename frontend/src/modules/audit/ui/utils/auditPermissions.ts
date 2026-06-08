export const AUDIT_PERMISSIONS = {
    VIEW_LOGS: 'audit.access.logs',
    VIEW_PAYLOAD: 'audit.access.payloads'
    
} as const

export type AuditPermission =
    typeof AUDIT_PERMISSIONS[keyof typeof AUDIT_PERMISSIONS]