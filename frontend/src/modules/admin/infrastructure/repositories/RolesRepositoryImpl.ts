import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type { RolesRepository } from "../../application/interfaces/RolesRepository";

import type {
  RoleResponseDto,
  RoleCreateRequestDto,
  RoleCreateResponseDto,
  PaginatedRolesDTO,
  RoleUpdateRequestDto
} from "../../domain/dto/RoleDTO";
import type { ParentRoleResponseDTO } from "../../domain/dto/ParentRoleDTO";

import {
  rolesToDomain,
  createRoleToDomain,
  paginatedRolesToDomain,
} from "../mappers/rolesMapper";
import { parentRolesToDomain } from "../mappers/parentRoleMapper";


import { API_ROUTES } from "@/shared/utils/apiRoutes";

export function createRolesRepository(http: HttpClient): RolesRepository {
  return {

    async getParentRoles(signal?: AbortSignal) {
      const dto = await http.request<ApiResponse<ParentRoleResponseDTO[]>>({
        url: API_ROUTES.ROLE_GET_ALL,
        method: "GET",
        withCredentials: false,
        timeoutMs: 15_000,
        signal,
      });

      return parentRolesToDomain(dto.data)

    },

    async getAllRoles(signal?: AbortSignal) {
      const dto = await http.request<ApiResponse<RoleResponseDto[]>>({
        url: API_ROUTES.ROLE_GET_ALL,
        method: "GET",
        withCredentials: false,
        timeoutMs: 15_000,
        signal,
      });

      return rolesToDomain(dto.data);

    },

    async getRolesPaginated(page, size, signal) {
      const dto = await http.request<ApiResponse<PaginatedRolesDTO>>({
        url: `${API_ROUTES.ROLE_GET_PAGINATED}?page=${page}&size=${size}`,
        method: "GET",
        signal,
      });

      return paginatedRolesToDomain(dto.data);
    },

    async createRole(
      roleName: string,
      parentRoleId: number,
      permissions: number[],
      signal?: AbortSignal) {

      const body: RoleCreateRequestDto = {
        roleName: roleName,
        parentRoleId: parentRoleId,
        permissions: permissions
      };

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

    async updateRole(
      roleId: number,
      roleName: string,
      parentRoleId: number,
      permissions: number[],
      signal?: AbortSignal) {

      const body: RoleUpdateRequestDto = {
        roleId: roleId,
        roleName: roleName,
        parentRoleId: parentRoleId,
        permissions: permissions
      };

      const dto = await http.request<ApiResponse<RoleCreateResponseDto>>({
        url: API_ROUTES.ROLE_UPDATE,
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