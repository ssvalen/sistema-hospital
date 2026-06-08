import type { Doctor } from "../../domain/entities/Doctor";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

export interface DoctorRepository {
    getAllDoctors(signal?: AbortSignal): Promise<Doctor[]>;
    getDoctorsPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Doctor>>;

    createDoctor(
        nombre: string,
        apellido: string,
        especialidad: string,
        telefono: string,
        email: string,
        signal?: AbortSignal
    ): Promise<Doctor>;

    updateDoctor(
        doctorId: number,
        nombre: string,
        apellido: string,
        especialidad: string,
        telefono: string,
        email: string,
        signal?: AbortSignal
    ): Promise<Doctor>;

}
