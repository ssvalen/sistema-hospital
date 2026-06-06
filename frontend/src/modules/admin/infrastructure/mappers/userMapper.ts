import type { User } from "../../domain/entities/User";
import type {
  UserRequestCreateDTO,
  UserResponseDTO,
  PaginatedUsersDTO,
  UserRolesReponseDTO
} from "../../domain/dto/UserDTO";

import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";
import type { BaseRole } from "../../domain/entities/BaseRole";

export function userToDomain(dto: UserResponseDTO): User {
  return {
    id: dto.idUsuario,
    username: dto.username,
    email: dto.email,
    status: dto.activo,
    name: dto.nombres ?? "",
    lastname: dto.apellidos ?? "",
    fullname: `${dto.nombres ?? ""} ${dto.apellidos ?? ""}`
  };
}

export function paginatedUsersToDomain( dto: PaginatedUsersDTO) {
  return paginatedMapper(dto, userToDomain);
}

export function rolesToDomain(dtos: UserResponseDTO[]): User[] {
  return dtos.map(userToDomain);
}

export function userRoleToDomain(dto: UserRolesReponseDTO): BaseRole {
  return {
    id: dto.idRol,
    name: dto.nombreRol
  }
}

export function userRolesToDomain(dtos: UserRolesReponseDTO[]): BaseRole[] {
  return dtos.map(userRoleToDomain);
}

// export function createRoleToDomain(
//   dto: RoleCreateResponseDto
// ): Role {
//   return {
//     id: dto.idRol,
//     roleName: dto.nombreRol,

//     parentRole: dto.rolPadre
//       ? parentRoleToDomain(dto.rolPadre)
//       : undefined,

//     permissions: dto.permisos
//       ? permissionsToDomain(dto.permisos)
//       : [],
//   };
// }