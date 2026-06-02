import type { Appointment } from "../../domain/entities/Appointment";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export interface AppointmentRepository {
    getAllAppointments(signal?: AbortSignal): Promise<Appointment[]>;
    getAppointmentsPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Appointment>>;


    getAppointmentByPatient(patientId: number, signal?: AbortSignal): Promise<Appointment>;
    getAppointmentsByPatient(patientId: number, signal?: AbortSignal): Promise<Appointment[]>;
    getAppointmentsByMedic(medicId: number, signal?: AbortSignal): Promise<Appointment[]>;

    createAppointment(
        patientId: number,
        medicId: number,
        appointmentDate: string,
        appointmentStatus: string,
        signal?: AbortSignal
    ): Promise<Appointment>;

    updateAppointment(
        appointmentId: number,
        patientId: number,
        medicId: number,
        appointmentDate: string,
        appointmentStatus: string,
        signal?: AbortSignal
    ): Promise<Appointment>;

}
