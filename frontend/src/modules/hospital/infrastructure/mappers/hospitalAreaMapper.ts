

import type { HospitalArea } from "../../domain/entities/HospitalArea";
import type { HospitalAreaResponseDTO } from "../../domain/dto/HospitalAreaDTO";


export function hospitalAreaToDomain(dto: HospitalAreaResponseDTO): HospitalArea {

    return {
        id: dto.idArea,
        name: dto.nombreArea,
        description: dto.descripcion,
        capacity: dto.capacidad,
        status: dto.activo,
        createdAt: dto.fechaCreacion,
        modifiedAt: dto.fechaModificacion
    }
}


export function hospitalAreasToDomain(dtos: HospitalAreaResponseDTO[]): HospitalArea[] {
    return dtos.map(hospitalAreaToDomain);
}
