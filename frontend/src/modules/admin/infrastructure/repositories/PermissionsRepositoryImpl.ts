import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";


import type { PermissionsRepository } from "../../application/interfaces/PermissionRepository";
import { createPermissionToDomain, paginatedPermissionsToDomain, permissionToDomain, permissionsToDomain } from "../mappers/permissionMapper";
import type { CreatePermissionResponseDTO, PermissionResponseDTO, CreatePermissionRequestDTO, UpdatePermissionRequestDTO, PaginatedPermissionsDTO } from "../../domain/dto/PermissionDTO";

import { API_ROUTES } from "@/shared/utils/apiRoutes";


export function createPermissionsRepository(http: HttpClient): PermissionsRepository {
  return {
    async getAllPermissions(signal?: AbortSignal) {
      const dto = await http.request<ApiResponse<PermissionResponseDTO[]>>({
        url: API_ROUTES.PERMISSION_GET_ALL,
        method: "GET",
        withCredentials: false,
        timeoutMs: 15_000,
        signal,
      });

      return permissionsToDomain(dto.data);
    },

    async getPermissionsByRole(roleId: number, signal?: AbortSignal) {
      const dto = await http.request<ApiResponse<PermissionResponseDTO[]>>({
        url: API_ROUTES.PERMISSION_GET_BY_ROLE(roleId),
        method: "GET",
        withCredentials: false,
        timeoutMs: 15_000,
        signal,
      });

      return permissionsToDomain(dto.data);
    },

    async getPermissionsPaginated(page, size, signal) {
      const dto = await http.request<ApiResponse<PaginatedPermissionsDTO>>({
        url: `${API_ROUTES.PERMISSION_GET_PAGINATED}?page=${page}&size=${size}`,
        method: "GET",
        signal,
      });

      return paginatedPermissionsToDomain(dto.data);
    },

    async createPermission(name: string) {
      const dto = await http.request<
        ApiResponse<CreatePermissionResponseDTO>
      >({
        url: API_ROUTES.PERMISSION_CREATE,
        method: "POST",
        body: {
          nombrePermiso: name,
        } satisfies CreatePermissionRequestDTO,
      });

      return createPermissionToDomain(dto.data);
    },

    async updatePermission(id: number, name: string) {
      const dto = await http.request<
        ApiResponse<CreatePermissionResponseDTO>
      >({
        url: `${API_ROUTES.PERMISSION_UPDATE}/${id}`,
        method: "PUT",
        body: {
          nombrePermiso: name,
        } satisfies UpdatePermissionRequestDTO,
      });

      return createPermissionToDomain(dto.data);
    }
  };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const permissionsRepository: PermissionsRepository =
  createPermissionsRepository(httpClient);