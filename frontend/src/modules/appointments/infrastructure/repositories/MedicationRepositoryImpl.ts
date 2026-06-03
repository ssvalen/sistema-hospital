import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type {
    TreatmentMedicationResponseDTO,
    CreateTreatmentMedicationRequestDTO
} from "../../domain/dto/MedicationDTO";

import type { MedicationRepository } from "../../application/interfaces/MedicationRepository";

import {
    medicationToDomain,
    medicationsToDomain
} from "../mappers/medicationsMapper";
import { API_ROUTES } from "@/shared/utils/apiRoutes";

export function createMedicationRepository(http: HttpClient): MedicationRepository {
    return {
        async getAllMedications(signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<TreatmentMedicationResponseDTO[]>>({
                url: API_ROUTES.MEDICATION_GET_ALL,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return medicationsToDomain(dto.data);
        },

        async getMedicationsByTreatment(treatmentId: number, signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<TreatmentMedicationResponseDTO[]>>({
                url: `${API_ROUTES.MEDICATION_GET_BY_TREATMENT}/${treatmentId}`,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return medicationsToDomain(dto.data);
        },


        async addMedicationToTreatment(
            treatmentId: number,
            medicId: number,
            dosage: string,
            quantity: number,
            signal?: AbortSignal) {
            const body: CreateTreatmentMedicationRequestDTO = {
                idTratamiento: treatmentId,
                idMedicamento: medicId,
                dosis: dosage,
                cantidad: quantity
            };

            const dto = await http.request<ApiResponse<TreatmentMedicationResponseDTO>>({
                url: API_ROUTES.MEDICATION_CREATE,
                method: "POST",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return medicationToDomain(dto.data);
        },

        async updateMedicationToTreatment(
            medicationTreatmentId: number,
            treatmentId: number,
            medicId: number,
            dosage: string,
            quantity: number,
            signal?: AbortSignal
        ) {
            const body: CreateTreatmentMedicationRequestDTO = {
                idTratamiento: treatmentId,
                idMedicamento: medicId,
                dosis: dosage,
                cantidad: quantity
            };

            const dto = await http.request<ApiResponse<TreatmentMedicationResponseDTO>>({
                url: `${API_ROUTES.MEDICATION_UPDATE}/${medicationTreatmentId}`,
                method: "PUT",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return medicationToDomain(dto.data);
        },

    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const medicationRepository: MedicationRepository =
    createMedicationRepository(httpClient);