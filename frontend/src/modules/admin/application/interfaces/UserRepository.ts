import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
import type { User } from "../../domain/entities/User";
import type { BaseRole } from "../../domain/entities/BaseRole";
import type { UserRequestParams } from "../../types/UserTypes";

export interface UserRepository {
    // getUsers(signal?: AbortSignal): Promise<User[]>;
    getUserRoles(id: number, signal?: AbortSignal): Promise<BaseRole[]>
    getUsersPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<User>>;
    createUser(params: UserRequestParams, signal?: AbortSignal): Promise<boolean>
    updateUser(params: UserRequestParams, signal?: AbortSignal): Promise<boolean>
    
}