import type { Permission } from "../../domain/entities/Permission";
import type { PermissionResponseDTO, CreatePermissionResponseDTO, PaginatedPermissionsDTO} from "../../domain/dto/PermissionDTO";
import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

export function permissionToDomain(dto: PermissionResponseDTO): Permission {
  return {
    id: dto.idPermiso,
    permissionName: dto.nombrePermiso,
  };
}

export function paginatedPermissionsToDomain(
  dto: PaginatedPermissionsDTO
) {
  return paginatedMapper(dto, permissionToDomain);
}

export function permissionsToDomain(
  dtos: PermissionResponseDTO[]
): Permission[] {
  return dtos.map(permissionToDomain);
}

export function createPermissionToDomain(
  dto: CreatePermissionResponseDTO
): Permission {
  return {
    id: dto.idPermiso,
    permissionName: dto.nombrePermiso,
  };
}