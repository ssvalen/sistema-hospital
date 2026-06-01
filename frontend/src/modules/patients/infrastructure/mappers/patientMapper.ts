import type { Patient } from "../../domain/entities/Patient";
import type { PaginatedPatientsDTO, PatientResponseDTO} from "../../domain/dto/PatientDTO";
import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

export function patientToDomain(dto: PatientResponseDTO): Patient {
  return {
    id: dto.idPaciente,
    nombre: dto.nombre,
    apellido: dto.apellido,
    fechaNacimiento: dto.fechaNacimiento,
    telefono: dto.telefono,
    direccion: dto.direccion,
    genero: dto.genero
  };
}

export function paginatedPatientsToDomain(
  dto: PaginatedPatientsDTO
) {
  return paginatedMapper(dto, patientToDomain);
}

export function patientsToDomain(
  dtos: PatientResponseDTO[]
): Patient[] {
  return dtos.map(patientToDomain);
}

export function createPatientToDomain(
  dto: PatientResponseDTO
): Patient {
  return {
    id: dto.idPaciente,
    nombre: dto.nombre,
    apellido: dto.apellido,
    fechaNacimiento: dto.fechaNacimiento,
    telefono: dto.telefono,
    direccion: dto.direccion,
    genero: dto.genero
  };
}