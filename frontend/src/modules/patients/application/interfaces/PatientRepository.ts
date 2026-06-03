
import type { Patient } from "../../domain/entities/Patient";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export interface PatientRepository {
    // getAllPatients(signal?: AbortSignal): Promise<Patient[]>;
    // getPatientsByRole(roleId: number, signal?: AbortSignal): Promise<Patient[]>;
    getPatientById(id: number, signal?: AbortSignal): Promise<Patient>;
    getPatientsPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Patient>>;
    createPatient(nombre: string, apellido: string, fechaNacimiento: string, telefono: number, direccion: string, genero: "M" | "F"): Promise<Patient>;
    updatePatient(id: number, nombre: string, apellido: string, fechaNacimiento: string, telefono: number, direccion: string, genero: "M" | "F"): Promise<Patient>;

}
