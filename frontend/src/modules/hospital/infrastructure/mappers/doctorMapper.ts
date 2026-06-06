import type { Doctor } from "../../domain/entities/Doctor";
import type {
    DoctorResponseDTO,
    PaginatedDoctorsDTO,
} from "../../domain/dto/DoctorDTO";
import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

export function doctorToDomain(dto: DoctorResponseDTO): Doctor {


    return {
        id: dto.idMedico,
        name: dto.nombre,
        lastName: dto.apellido,
        fullName: `${dto.nombre} ${dto.apellido}`,
        phoneNumber: dto.telefono,
        email: dto.email,
        speciality: dto.especialidad
    }
}

export function paginatedDoctorsToDomain(
    dto: PaginatedDoctorsDTO
) {
    return paginatedMapper(dto, doctorToDomain);
}

export function doctorsToDomain(dtos: DoctorResponseDTO[]): Doctor[] {
    return dtos.map(doctorToDomain);
}
