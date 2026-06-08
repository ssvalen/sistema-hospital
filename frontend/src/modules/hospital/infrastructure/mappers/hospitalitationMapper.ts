import type { Hospitalitation } from "../../domain/entities/Hospitalitation";
import type {
    HospitalitationResponseDTO,
    HospitalitationPaginatedDTO
} from "../../domain/dto/HospitalitationDTO";
import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

import type { HospitalitationStatus } from "../../types/HospitalitationStatus";

export function hospitalitationToDomain(dto: HospitalitationResponseDTO): Hospitalitation {

    return {
        id: dto.idIngreso,
        status: dto.activo,
        hospitalitation: {
            motiveIngress: dto.motivoIngreso,
            motiveEgress: dto.motivoEgreso,
            observations: dto.observaciones,
            startDate: dto.fechaIngreso,
            endDate: dto.fechaEgreso,
            status: dto.estado as HospitalitationStatus
        },
        hospitalArea: {
           id: dto.idArea,
           name: dto.nombreArea 
        },
        patient: {
            id: dto.idPaciente,
            name: dto.nombrePaciente,
            lastname: dto.apellidoPaciente,
            fullname: `${dto.nombrePaciente} ${dto.apellidoPaciente}`
        }
    }
}

export function paginatedHospitalitationsToDomain(
    dto: HospitalitationPaginatedDTO
) {
    return paginatedMapper(dto, hospitalitationToDomain);
}

export function hospitalitationsToDomain(dtos: HospitalitationResponseDTO[]): Hospitalitation[] {
    return dtos.map(hospitalitationToDomain);
}
