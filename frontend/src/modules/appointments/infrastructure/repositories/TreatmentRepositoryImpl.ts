import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type {
    TreatmentRequestDTO,
    TreatmentResponseDTO,
    PaginatedTreatmentsDTO,
    CreateTreatmentRequestDTO
} from "../../domain/dto/TreatmentDTO";

import type { TreatmentRepository } from "../../application/interfaces/TreatmentRepository";

import {
    treatmentToDomain,
    treatmentsToDomain,
    paginatedTreatmentsToDomain
} from "../mappers/treatmentsMapper";
import { API_ROUTES } from "@/shared/utils/apiRoutes";

export function createTreatmentRepository(http: HttpClient): TreatmentRepository {
    return {
        async getAllTreatments(signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<TreatmentResponseDTO[]>>({
                url: API_ROUTES.TREATMENT_GET_ALL,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return treatmentsToDomain(dto.data);
        },

        async getTreatmentsPaginated(page, size, signal) {
            const dto = await http.request<ApiResponse<PaginatedTreatmentsDTO>>({
                url: `${API_ROUTES.TREATMENT_GET_PAGINATED}?page=${page}&size=${size}`,
                method: "GET",
                signal,
            });

            return paginatedTreatmentsToDomain(dto.data);
        },

        async getTreatmentsByAppointment(appointmentId: number, signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<TreatmentResponseDTO[]>>({
                url: `${API_ROUTES.TREATMENT_GET_BY_APPOINTMENT}/${appointmentId}`,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return treatmentsToDomain(dto.data);
        },

        async getTreatmentsByPatient(patientId: number, signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<TreatmentResponseDTO[]>>({
                url: `${API_ROUTES.TREATMENT_GET_BY_PATIENT}/${patientId}`,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return treatmentsToDomain(dto.data);
        },

        async createTreatment(
            appointmentId: number,
            description: string,
            from: string,
            to: string,
            signal?: AbortSignal) {
            const body: CreateTreatmentRequestDTO = {
                idCita: appointmentId,
                descripcion: description,
                fechaInicio: from,
                fechaFin: to
            };

            const dto = await http.request<ApiResponse<TreatmentResponseDTO>>({
                url: `${API_ROUTES.TREATMENT_CREATE}`,
                method: "POST",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return treatmentToDomain(dto.data);
        },

        async updateTreatment(
            treatmentId: number,
            appointmentId: number,
            description: string,
            from: string,
            to: string,
            signal?: AbortSignal) {
            const body: CreateTreatmentRequestDTO = {
                idCita: appointmentId,
                descripcion: description,
                fechaInicio: from,
                fechaFin: to
            };

            const dto = await http.request<ApiResponse<TreatmentResponseDTO>>({
                url: `${API_ROUTES.TREATMENT_UPDATE}/${treatmentId}`,
                method: "PUT",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return treatmentToDomain(dto.data);
        },

    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const treatmentRepository: TreatmentRepository =
    createTreatmentRepository(httpClient);