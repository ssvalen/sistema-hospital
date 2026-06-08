import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type {
    DoctorRequestDTO,
    DoctorResponseDTO,
    PaginatedDoctorsDTO
} from "../../domain/dto/DoctorDTO";

import type { DoctorRepository } from "../../application/interfaces/DoctorRepository";

import {
    doctorToDomain,
    doctorsToDomain,
    paginatedDoctorsToDomain
} from "../mappers/doctorMapper";
import { API_ROUTES } from "@/shared/utils/apiRoutes";

export function createDoctorRepository(http: HttpClient): DoctorRepository {
    return {
        async getAllDoctors(signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<DoctorResponseDTO[]>>({
                url: API_ROUTES.DOCTORS_GET_ALL,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return doctorsToDomain(dto.data);
        },

        async getDoctorsPaginated(page, size, signal) {
            const dto = await http.request<ApiResponse<PaginatedDoctorsDTO>>({
                url: `${API_ROUTES.DOCTORS_GET_PAGINATED}?page=${page}&size=${size}`,
                method: "GET",
                signal,
            });

            return paginatedDoctorsToDomain(dto.data);
        },


        async createDoctor(
            nombre: string,
            apellido: string,
            especialidad: string,
            telefono: string,
            email: string,
            signal?: AbortSignal) {
            const body: DoctorRequestDTO = {
                nombre: nombre,
                apellido: apellido,
                especialidad: especialidad,
                telefono: telefono,
                email: email
            };

            const dto = await http.request<ApiResponse<DoctorResponseDTO>>({
                url: `${API_ROUTES.DOCTORS_CREATE}`,
                method: "POST",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return doctorToDomain(dto.data);
        },

        async updateDoctor(
            doctorId: number,
            nombre: string,
            apellido: string,
            especialidad: string,
            telefono: string,
            email: string,
            signal?: AbortSignal) {
            const body: DoctorRequestDTO = {
                nombre: nombre,
                apellido: apellido,
                especialidad: especialidad,
                telefono: telefono,
                email: email
            };

            const dto = await http.request<ApiResponse<DoctorResponseDTO>>({
                url: `${API_ROUTES.DOCTORS_UPDATE}/${doctorId}`,
                method: "PUT",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return doctorToDomain(dto.data);
        },

    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const doctorRepository: DoctorRepository =
    createDoctorRepository(httpClient);