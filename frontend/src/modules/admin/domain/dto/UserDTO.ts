import type { UserRoles } from "../../types/UserTypes";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export type UserRequestCreateDTO = {
    username: string;
    email: string;
    primerNombre: string;
    apellidos: string;
    password: string;
    idRolesHijo: number[];
}

export type PaginatedUsersDTO = PaginatedResponse<UserResponseDTO>;

export type UserResponseDTO = {
    idUsuario: number;
    username: string;
    email: string;
    activo: boolean;
    roles: UserRoles[];
    nombres: string;
    apellidos: string;
}

export type UserRolesReponseDTO = {
    idRol: number;
    nombreRol: string;
}