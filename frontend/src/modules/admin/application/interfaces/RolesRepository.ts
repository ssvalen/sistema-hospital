
import type { Role } from "../../domain/entities/Role";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
export interface RolesRepository {
    getAllRoles(signal?: AbortSignal): Promise<Role[]>;
    createRole(roleName: string, signal?: AbortSignal): Promise<Role>;
    getRolesPaginated(
            page: number,
            size: number,
            signal?: AbortSignal
        ): Promise<PaginatedResponse<Role>>;
    // putRole(role: Role, signal?: AbortSignal): Promise<Role>;
    // deleteRole(roleId: number, signal?: AbortSignal): Promise<void>;
}
