
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
export type DoctorRequestDTO = {
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    email: string;
}

export type DoctorResponseDTO = {
    idMedico: number;
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    email: string;
    cantidadCitas: number;
}

export type PaginatedDoctorsDTO = PaginatedResponse<DoctorResponseDTO>;