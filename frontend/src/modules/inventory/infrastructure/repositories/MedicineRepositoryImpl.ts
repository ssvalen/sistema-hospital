import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";
import type { RequestMedicineQueryParams } from "../../types/MedicineTypes";

import type { MedicineRepository } from "../../application/interfaces/MedicineRepository";
import { paginatedMedicinesToDomain, medicinesToDomain, medicineToDomain } from "../mappers/medicineMapper";
import type {
    PaginatedMedicinesDTO,
    MedicineResponseDTO,
    MedicineRequestDTO
} from "../../domain/dto/MedicineDTO";

import { API_ROUTES } from "@/shared/utils/apiRoutes";


export function createMedicinesRepository(http: HttpClient): MedicineRepository {
    return {

        async getMedicineById(id, signal) {
            const dto = await http.request<ApiResponse<MedicineResponseDTO>>({
                url: `${API_ROUTES.MEDICINE_ENDPOINT}/${id}`,
                method: "GET",
                signal,
            });

            return medicineToDomain(dto.data);
        },

        async getMedicinesPaginated(page, size, signal) {
            const dto = await http.request<ApiResponse<PaginatedMedicinesDTO>>({
                url: `${API_ROUTES.MEDICINE_PAGINATED}?page=${page}&size=${size}`,
                method: "GET",
                signal,
            });

            return paginatedMedicinesToDomain(dto.data);
        },

        async createMedicine(params: RequestMedicineQueryParams, signal) {

            const body: MedicineRequestDTO = {
                nombreComercial: params.commercialName,
                principioActivo: params.principalActive,
                unidadMedida: params.unit
            }

            const dto = await http.request<ApiResponse<MedicineResponseDTO>>({
                url: API_ROUTES.MEDICINE_ENDPOINT,
                method: "POST",
                body,
                signal
            });

            return medicineToDomain(dto.data);
        },

        async updateMedicine(params: RequestMedicineQueryParams, signal) {

            const body: MedicineRequestDTO = {
                nombreComercial: params.commercialName,
                principioActivo: params.principalActive,
                unidadMedida: params.unit
            }

            const dto = await http.request<ApiResponse<MedicineResponseDTO>>({
                url: `${API_ROUTES.MEDICINE_ENDPOINT}/${params.id}`,
                method: "PUT",
                body,
                signal
            });

            return medicineToDomain(dto.data);
        },
    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const medicineRepository: MedicineRepository =
    createMedicinesRepository(httpClient);