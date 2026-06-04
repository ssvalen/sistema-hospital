import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse"

export type HospitalitationResponseDTO = {
    idIngreso: number,
    idPaciente: number,
    nombrePaciente: string,
    apellidoPaciente: string,
    idArea: number,
    nombreArea: string,
    fechaIngreso: string,
    fechaEgreso: string,
    motivoIngreso: string,
    motivoEgreso: string,
    estado: string,
    observaciones: string,
    activo: boolean
}

export type HospitalitationPaginatedDTO = PaginatedResponse<HospitalitationResponseDTO>;

export type HospitalitationIngressRequestDTO = {
    idPaciente: number;
    idArea: number;
    motivoIngreso: string;
    observaciones: string;
}

export type HospitalitationEgressRequestDTO = {
    motivoEgreso: string;
    estado: string;
    observaciones: string;
}

