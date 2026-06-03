
import type { ParentRole } from "../../domain/entities/ParentRole";
import type { Role } from "../../domain/entities/Role";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
export interface RolesRepository {
    getParentRoles(signal?: AbortSignal): Promise<ParentRole[]>;
    getAllRoles(signal?: AbortSignal): Promise<Role[]>;
    getRolesPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Role>>;
    createRole(
        roleName: string,
        parentRoleId: number,
        permissions: number[],
        signal?: AbortSignal
    ): Promise<Role>;
    updateRole(
        roleId: number,
        roleName: string,
        parentRoleId: number,
        permissions: number[],
        signal?: AbortSignal
    ): Promise<Role>;

}
