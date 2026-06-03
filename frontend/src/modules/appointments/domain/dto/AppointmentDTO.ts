import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export type AppointmentRequestDTO = {
    fechaHoraCita: string;
    estado: string;
    idPaciente: number;
    idMedico: number;
}
export type AppointmentResponseDTO = {
    idCita: number;
    fechaHora: string;
    estado: string;
    idPaciente: number;
    pacienteNombre: string;
    pacienteApellido: string;
    idMedico: number;
    medicoNombre: string;
    medicoApellido: string;
    medicoEspecialidad: string;
}

export type PaginatedAppointmentsDTO = PaginatedResponse<AppointmentResponseDTO>;

export type CreateAppointmentRequestDTO  = {
    fechaHora: string;
    estado: string;
    idPaciente: number;
    idMedico: number;
}