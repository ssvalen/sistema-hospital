import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
import type { PermissionResponseDTO } from "./PermissionDTO";
import type { ParentRoleResponseDTO } from "./ParentRoleDTO";

export type RoleResponseDto = {
  idRol: number;
  nombreRol: string;
  rolPadre?: ParentRoleResponseDTO;
  permisos?: PermissionResponseDTO[];
};

export type PaginatedRolesDTO = PaginatedResponse<RoleResponseDto>;

export type RoleCreateRequestDto = {
  nombreRol: string;
  modelRoleId: number;
  permissions: number[];
};

export type RoleUpdateRequestDto = {
  nombreRol: string;
  modelRoleId: number;
  permissions: number[];
};

export type RoleCreateResponseDto = {
  idRol: number;
  nombreRol: string;
  rolPadre?: ParentRoleResponseDTO;
  permisos?: PermissionResponseDTO[];
};



export type RoleRemoveResponseDTO = {
  success: boolean;
  message: string;
}