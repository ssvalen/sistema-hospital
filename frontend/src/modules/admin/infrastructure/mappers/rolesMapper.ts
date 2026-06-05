import type { Role } from "../../domain/entities/Role";
import type {
  RoleResponseDto,
  RoleCreateResponseDto,
  PaginatedRolesDTO,
} from "../../domain/dto/RoleDTO";

import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

import { parentRoleToDomain } from "./parentRoleMapper";
import { permissionsToDomain } from "./permissionMapper";

export function roleToDomain(dto: RoleResponseDto): Role {
  return {
    id: dto.idRol,
    roleName: dto.nombreRol,

    parentRole: dto.rolPadre
      ? parentRoleToDomain(dto.rolPadre)
      : undefined,

    permissions: dto.permisos
      ? permissionsToDomain(dto.permisos)
      : [],
  };
}

export function paginatedRolesToDomain(
  dto: PaginatedRolesDTO
) {
  return paginatedMapper(dto, roleToDomain);
}

export function rolesToDomain(
  dtos: RoleResponseDto[]
): Role[] {
  return dtos.map(roleToDomain);
}

export function createRoleToDomain(
  dto: RoleCreateResponseDto
): Role {
  return {
    id: dto.idRol,
    roleName: dto.nombreRol,

    parentRole: dto.rolPadre
      ? parentRoleToDomain(dto.rolPadre)
      : undefined,

    permissions: dto.permisos
      ? permissionsToDomain(dto.permisos)
      : [],
  };
}