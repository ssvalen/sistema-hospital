import type { Appointment } from "../../domain/entities/Appointment";
import type {
    AppointmentRequestDTO,
    AppointmentResponseDTO,
    PaginatedAppointmentsDTO,
    CreateAppointmentRequestDTO
} from "../../domain/dto/AppointmentDTO";
import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

export function appointmentToDomain(dto: AppointmentResponseDTO): Appointment {

    const [date, time = ""] = dto.fechaHora.split(" ");

    return {
        id: dto.idCita,
        startDate: date,
        startTime: time,
        status: dto.estado,

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
    };
}

export function paginatedAppointmentsToDomain(
    dto: PaginatedAppointmentsDTO
) {
    return paginatedMapper(dto, appointmentToDomain);
}

export function appointmentsToDomain(dtos: AppointmentResponseDTO[]): Appointment[] {
    return dtos.map(appointmentToDomain);
}
