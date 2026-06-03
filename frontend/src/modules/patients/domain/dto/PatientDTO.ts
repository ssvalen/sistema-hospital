import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";



export type CreatePatientRequestDTO = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: number;
  direccion: string;
  genero: "M" | "F";
};


export type PatientResponseDTO = {
  idPaciente: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: number;
  direccion: string;
  genero: "M" | "F";
};

export type PaginatedPatientsDTO = PaginatedResponse<PatientResponseDTO>;

export type UpdatePatientRequestDTO = {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: number;
  direccion: string;
  genero: "M" | "F";
};
