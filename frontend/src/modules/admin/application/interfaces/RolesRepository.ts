
import type { ParentRole } from "../../domain/entities/ParentRole";
import type { Role } from "../../domain/entities/Role";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
import type { RoleRemoveResponseDTO } from "../../domain/dto/RoleDTO";
export interface RolesRepository {
    getParentRoles(signal?: AbortSignal): Promise<ParentRole[]>;
    getRoleById(roleId: number, signal?: AbortSignal): Promise<Role>;
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

    removeRole(roleId: number): Promise<RoleRemoveResponseDTO>;

}
