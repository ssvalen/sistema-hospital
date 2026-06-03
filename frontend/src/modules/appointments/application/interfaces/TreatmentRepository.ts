import type { Treatment } from "../../domain/entities/Treatment";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export interface TreatmentRepository {
    getAllTreatments(signal?: AbortSignal): Promise<Treatment[]>;
    getTreatmentsPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Treatment>>;


    getTreatmentsByAppointment(appointmentId: number, signal?: AbortSignal): Promise<Treatment[]>;
    getTreatmentsByPatient(patientId: number, signal?: AbortSignal): Promise<Treatment[]>;


    createTreatment(
        appointmentId: number,
        description: string,
        from: string,
        to: string,
        signal?: AbortSignal
    ): Promise<Treatment>;

    updateTreatment(
        treatmentId: number,
        appointmentId: number,
        description: string,
        from: string,
        to: string,
        signal?: AbortSignal
    ): Promise<Treatment>;

}
