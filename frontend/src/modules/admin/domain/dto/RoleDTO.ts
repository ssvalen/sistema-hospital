import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
export type RoleResponseDto = {
  idRol: number;
  nombreRol: string;
  permissions?: string[];
};

export type PaginatedRolesDTO = PaginatedResponse<RoleResponseDto>;

export type RoleCreateRequestDto = {
  roleName: string;
};

export type RoleCreateResponseDto = {
  idRol: number;
  nombreRol: string;
  permissions?: string[];
};