
import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type { UserRepository } from "../../application/interfaces/UserRepository";

import { API_ROUTES } from "@/shared/utils/apiRoutes";
import type {
    PaginatedUsersDTO,
    UserRequestCreateDTO,
    UserResponseDTO,
    UserRolesReponseDTO
} from "../../domain/dto/UserDTO";
import { paginatedUsersToDomain, userRolesToDomain, userToDomain } from "../mappers/userMapper";


export function createUserRepository(http: HttpClient): UserRepository {
    return {
        async getUsersPaginated(page, size, signal) {
            const dto = await http.request<ApiResponse<PaginatedUsersDTO>>({
                url: `${API_ROUTES.USER_GET_PAGINATED}?page=${page}&size=${size}`,
                method: "GET",
                signal,
            });

            return paginatedUsersToDomain(dto.data);
        },

        async getUserRoles(userId, signal) {
            const dto = await http.request<ApiResponse<UserRolesReponseDTO[]>>({
                url: API_ROUTES.USER_GET_ROLES(userId),
                method: "GET",
                signal,
            });

            return userRolesToDomain(dto.data);
        },

        async updateUser(params, signal) {

            const body: UserRequestCreateDTO = {
                username: params.username,
                email: params.email,
                primerNombre: params.name,
                apellidos: params.lastname,
                password: params.password,
                idRolesHijo: params.roles
            };

            const dto = await http.request<ApiResponse<UserResponseDTO>>({
                url: `${API_ROUTES.USER_ENDPOINT}/${params.id}`,
                method: "PUT",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return dto.success
        },
        async createUser(params, signal) {

            const body: UserRequestCreateDTO = {
                username: params.username,
                email: params.email,
                primerNombre: params.name,
                apellidos: params.lastname,
                password: params.password,
                idRolesHijo: params.roles
            };
            const dto = await http.request<ApiResponse<UserResponseDTO>>({
                url: API_ROUTES.USER_ENDPOINT,
                method: "POST",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return dto.success
        },
    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const userRepository: UserRepository =
    createUserRepository(httpClient);