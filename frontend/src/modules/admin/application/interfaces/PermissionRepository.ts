
import type { Permission } from "../../domain/entities/Permission";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export interface PermissionsRepository {
    getAllPermissions(signal?: AbortSignal): Promise<Permission[]>;
    getPermissionsByRole(roleId: number, signal?: AbortSignal): Promise<Permission[]>;
    getPermissionsPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Permission>>;
    createPermission(name: string): Promise<Permission>;
    updatePermission(id: number, name: string): Promise<Permission>;
    // inactivatePermission(id: number): Promise<void>;
}
