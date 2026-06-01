import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export type PermissionResponseDTO = {
  idPermiso: number;
  nombrePermiso: string;
};

export type PaginatedPermissionsDTO = PaginatedResponse<PermissionResponseDTO>;

export type CreatePermissionRequestDTO = {
  nombrePermiso: string;
};

export type CreatePermissionResponseDTO = {
  idPermiso: number;
  nombrePermiso: string;
};

export type UpdatePermissionRequestDTO = {
  nombrePermiso: string;
};