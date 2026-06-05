export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "LOGIN";
// export type AuditEntity = "User" | "Paciente" | "Rol" | "RESTORE" | "LOGIN";
type AuditDiff<T = unknown> = {
    oldValue: T;
    newValue: T;
}

export type AuditDiffMap = Record<string, AuditDiff>; 
