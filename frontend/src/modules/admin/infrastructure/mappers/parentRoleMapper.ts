import type { ParentRole } from "../../domain/entities/ParentRole";
import type { ParentRoleResponseDTO } from "../../domain/dto/ParentRoleDTO";


export function parentRoleToDomain(dto: ParentRoleResponseDTO): ParentRole {
  return {
    id: dto.idRolPadre,
    name: dto.nombreRolPadre
  };
}

export function parentRolesToDomain(dtos: ParentRoleResponseDTO[]): ParentRole[] {
  return dtos.map(parentRoleToDomain);
}