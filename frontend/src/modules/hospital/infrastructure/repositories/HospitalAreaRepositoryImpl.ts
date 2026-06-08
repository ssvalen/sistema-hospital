
import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";
import { API_ROUTES } from "@/shared/utils/apiRoutes";

import type {
    HospitalAreaResponseDTO,
    HospitalAreaRequestDTO
} from "../../domain/dto/HospitalAreaDTO";

import type { HospitalAreaRequestParams } from "../../types/HospitalAreaTypes";
import {
    hospitalAreaToDomain,
    hospitalAreasToDomain
} from "../mappers/hospitalAreaMapper";

import type { HospitalAreasRepository } from "../../application/interfaces/HospitalAreasRepository";

export function createHospitalAreaRepository(http: HttpClient): HospitalAreasRepository {
    return {
        async getAllAreas(signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<HospitalAreaResponseDTO[]>>({
                url: API_ROUTES.HOSPITAL_AREA_GET_ALL,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return hospitalAreasToDomain(dto.data);
        },


        async createArea(params: HospitalAreaRequestParams, signal?: AbortSignal) {
            const body: HospitalAreaRequestDTO = {
                nombreArea: params.name,
                descripcion: params.description,
                capacidad: params.capacity,
                activo: params.status
            };

            const dto = await http.request<ApiResponse<HospitalAreaResponseDTO>>({
                url: `${API_ROUTES.HOSPITAL_AREA_CREATE}`,
                method: "POST",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return hospitalAreaToDomain(dto.data);
        },

        async updateArea(params: HospitalAreaRequestParams, signal?: AbortSignal) {
            const body: HospitalAreaRequestDTO = {
                nombreArea: params.name,
                descripcion: params.description,
                capacidad: params.capacity,
                activo: params.status
            };

            const dto = await http.request<ApiResponse<HospitalAreaResponseDTO>>({
                url: API_ROUTES.HOSPITALITATION_EGRESS(params.id),
                method: "PUT",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return hospitalAreaToDomain(dto.data);
        },

    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const hospitalAreaRepository: HospitalAreasRepository =
    createHospitalAreaRepository(httpClient);