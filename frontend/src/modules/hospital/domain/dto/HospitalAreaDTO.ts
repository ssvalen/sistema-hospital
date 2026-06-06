export type HospitalAreaResponseDTO = {
    idArea: number;
    nombreArea: string;
    descripcion: string;
    capacidad: number;
    activo: boolean;
    fechaCreacion: string;
    fechaModificacion: string;
}

export type HospitalAreaRequestDTO = {
    nombreArea: string;
    descripcion: string;
    capacidad: number;
    activo: boolean;
}