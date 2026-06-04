import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";
import { API_ROUTES } from "@/shared/utils/apiRoutes";

import type {
    HospitalitationResponseDTO,
    HospitalitationPaginatedDTO,
    HospitalitationIngressRequestDTO,
    HospitalitationEgressRequestDTO
} from "../../domain/dto/HospitalitationDTO";

import type {
    HospitalitationRequestParams,
    HospitalitationEgressRequestParams
} from "../../types/HospitalitationTypes";
import {
    hospitalitationsToDomain,
    hospitalitationToDomain,
    paginatedHospitalitationsToDomain
} from "../mappers/hospitalitationMapper";
import type { HospitalitationRepository } from "../../application/interfaces/HospitalitationRepository";

export function createHospitalitationRepository(http: HttpClient): HospitalitationRepository {
    return {
        async getAllHospitalitations(signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<HospitalitationResponseDTO[]>>({
                url: API_ROUTES.HOSPITALITATION_GET_ALL,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return hospitalitationsToDomain(dto.data);
        },

        async getHospitalitationsPaginated(page, size, signal) {
            const dto = await http.request<ApiResponse<HospitalitationPaginatedDTO>>({
                url: `${API_ROUTES.HOSPITALITATION_GET_PAGINATED}?page=${page}&size=${size}`,
                method: "GET",
                signal,
            });

            return paginatedHospitalitationsToDomain(dto.data);
        },

        async getHospitalitationById(hospitalitationId: number, signal?: AbortSignal) {

            const hospitalitationResponseDTODummy: HospitalitationResponseDTO = {
                idIngreso: 1,
                idPaciente: 100,
                nombrePaciente: "María",
                apellidoPaciente: "González",
                idArea: 3,
                nombreArea: "Unidad de Terapia Intensiva",
                fechaIngreso: "2026-06-01T08:30:00Z",
                fechaEgreso: "2026-06-05T14:20:00Z",
                motivoIngreso: "Neumonía bilateral",
                motivoEgreso: "Alta médica por evolución favorable",
                estado: "INTERNADO", // Puede ser "INTERNADO" | "EGRESADO" | "TRASLADADO"
                observaciones: "Paciente respondió adecuadamente al tratamiento antibiótico.",
                activo: true
            };

            const dto = await http.request<ApiResponse<HospitalitationResponseDTO>>({
                url: `${API_ROUTES.HOSPITALITATION_GET_BY_ID}/${hospitalitationId}`,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            // return hospitalitationToDomain(dto.data);
            const x = hospitalitationToDomain(hospitalitationResponseDTODummy);
            console.log(x)
            return x
        },

        async getHospitalitationsByPatient(patientId, signal) {
            const dto: HospitalitationResponseDTO[] = [
                {
                    idIngreso: 1,
                    idPaciente: 100,
                    nombrePaciente: "María",
                    apellidoPaciente: "González",
                    idArea: 3,
                    nombreArea: "Unidad de Terapia Intensiva",
                    fechaIngreso: "2026-06-01T08:30:00Z",
                    // fechaEgreso: "2026-06-05T14:20:00Z",
                    motivoIngreso: "Neumonía bilateral",
                    // motivoEgreso: "Alta médica por evolución favorable",
                    estado: "EGRESADO", // Puede ser "INTERNADO" | "EGRESADO" | "TRASLADADO"
                    observaciones: "Paciente respondió adecuadamente al tratamiento antibiótico.",
                    activo: true
                },
                {
                    idIngreso: 2,
                    idPaciente: 100,
                    nombrePaciente: "María",
                    apellidoPaciente: "González",
                    idArea: 3,
                    nombreArea: "Unidad de Terapia Intensiva",
                    fechaIngreso: "2026-06-01T08:30:00Z",
                    fechaEgreso: "2026-06-05T14:20:00Z",
                    motivoIngreso: "Neumonía bilateral 2",
                    motivoEgreso: "Alta médica por evolución favorable",
                    estado: "EGRESADO", // Puede ser "INTERNADO" | "EGRESADO" | "TRASLADADO"
                    observaciones: "Paciente respondió adecuadamente al tratamiento antibiótico.",
                    activo: true
                }
            ];

            // const dto = await http.request<ApiResponse<HospitalitationResponseDTO>>({
            //     url: `${API_ROUTES.HOSPITALITATION_GET_BY_ID}/${hospitalitationId}`,
            //     method: "GET",
            //     withCredentials: false,
            //     timeoutMs: 15_000,
            //     signal,
            // });

            return hospitalitationsToDomain(dto)

        },


        async ingressHospitalitation(params: HospitalitationRequestParams, signal?: AbortSignal) {
            const body: HospitalitationIngressRequestDTO = {
                idPaciente: params.patientId,
                idArea: params.areaId,
                motivoIngreso: params.motive,
                observaciones: params.observations
            };

            const dto = await http.request<ApiResponse<HospitalitationResponseDTO>>({
                url: `${API_ROUTES.HOSPITALITATION_INGRESS}`,
                method: "POST",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return hospitalitationToDomain(dto.data);
        },

        async egressHospitalitation(params: HospitalitationEgressRequestParams, signal?: AbortSignal) {
            const body: HospitalitationEgressRequestDTO = {
                motivoEgreso: params.motive,
                estado: params.status,
                observaciones: params.observations
            };

            const dto = await http.request<ApiResponse<HospitalitationResponseDTO>>({
                url: `${API_ROUTES.DOCTORS_UPDATE}/${params.hospitalitationId}`,
                method: "PUT",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return hospitalitationToDomain(dto.data);
        },

    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const hospitalitationRepository: HospitalitationRepository =
    createHospitalitationRepository(httpClient);