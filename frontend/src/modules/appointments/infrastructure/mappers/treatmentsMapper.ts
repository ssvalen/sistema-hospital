import type { Treatment } from "../../domain/entities/Treatment";
import type {
    TreatmentResponseDTO,
    PaginatedTreatmentsDTO,
} from "../../domain/dto/TreatmentDTO";

import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";
import { medicationToDomain, medicationsToDomain } from "./medicationsMapper";

export function treatmentToDomain(
    dto: TreatmentResponseDTO
): Treatment {
    return {
        id: dto.idTratamiento,
        description: dto.descripcion,
        from: dto.fechaInicio,
        to: dto.fechaFin,

        appointment: {
            id: dto.idCita,
            date: dto.citaFechaHora,
            status: dto.citaEstado,
        },

        patient: {
            id: dto.idPaciente,
            firstName: dto.pacienteNombre,
            lastName: dto.pacienteApellido,
            fullName: `${dto.pacienteNombre} ${dto.pacienteApellido}`,
        },

        doctor: {
            id: dto.idMedico,
            firstName: dto.medicoNombre,
            lastName: dto.medicoApellido,
            specialty: dto.medicoEspecialidad,
            fullName: `${dto.medicoNombre} ${dto.medicoApellido}`,
        },

        medications: medicationsToDomain(dto.medicamentos),
    };
}

export function paginatedTreatmentsToDomain(dto: PaginatedTreatmentsDTO) {
    return paginatedMapper(dto, treatmentToDomain);
}

export function treatmentsToDomain(
    dtos: TreatmentResponseDTO[]
): Treatment[] {
    return dtos.map(treatmentToDomain);
}