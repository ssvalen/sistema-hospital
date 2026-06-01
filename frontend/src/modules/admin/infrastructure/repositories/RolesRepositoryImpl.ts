import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type {
  RoleResponseDto,
  RoleCreateRequestDto,
  RoleCreateResponseDto,
  PaginatedRolesDTO,
} from "../../domain/dto/RoleDTO";

import type { RolesRepository } from "../../application/interfaces/RolesRepository";

import {
  rolesToDomain,
  createRoleToDomain,
  paginatedRolesToDomain,
} from "../mappers/rolesMapper";
import { API_ROUTES } from "@/shared/utils/apiRoutes";

export function createRolesRepository(http: HttpClient): RolesRepository {
  return {
    async getAllRoles(signal?: AbortSignal) {
      const dto = await http.request<ApiResponse<RoleResponseDto[]>>({
        url: API_ROUTES.ROLE_GET_ALL,
        method: "GET",
        withCredentials: false,
        timeoutMs: 15_000,
        signal,
      });

      const roles = rolesToDomain(dto.data);
      return roles;
    },

    async getRolesPaginated(page, size, signal) {
      const dto = await http.request<ApiResponse<PaginatedRolesDTO>>({
        url: `${API_ROUTES.ROLE_GET_PAGINATED}?page=${page}&size=${size}`,
        method: "GET",
        signal,
      });

      return paginatedRolesToDomain(dto.data);
    },

    async createRole(roleName: string, signal?: AbortSignal) {
      const body: RoleCreateRequestDto = { roleName };

      const dto = await http.request<ApiResponse<RoleCreateResponseDto>>({
        url: API_ROUTES.ROLE_CREATE,
        method: "POST",
        body,
        withCredentials: false,
        timeoutMs: 15_000,
        signal,
      });

      return createRoleToDomain(dto.data);
    },
  };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const rolesRepository: RolesRepository =
  createRolesRepository(httpClient);