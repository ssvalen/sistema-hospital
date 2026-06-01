import type { Role } from "../../domain/entities/Role";
import type {
  RoleResponseDto,
  RoleCreateResponseDto,
  PaginatedRolesDTO,
} from "../../domain/dto/RoleDTO";
import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

export function roleToDomain(dto: RoleResponseDto): Role {
  return {
    id: dto.idRol,
    roleName: dto.nombreRol,
    permissions: dto.permissions ?? [],
  };
}

export function paginatedRolesToDomain(
  dto: PaginatedRolesDTO
) {
  return paginatedMapper(dto, roleToDomain);
}

export function rolesToDomain(dtos: RoleResponseDto[]): Role[] {
  return dtos.map(roleToDomain);
}

export function createRoleToDomain(dto: RoleCreateResponseDto): Role {
  return {
    id: dto.idRol,
    roleName: dto.nombreRol,
    permissions: dto.permissions ?? [],
  };
}