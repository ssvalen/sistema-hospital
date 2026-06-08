import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";


import type { PatientRepository } from "../../application/interfaces/PatientRepository";
import { createPatientToDomain, paginatedPatientsToDomain, patientsToDomain } from "../mappers/patientMapper";
import type { CreatePatientRequestDTO, PaginatedPatientsDTO, PatientResponseDTO, UpdatePatientRequestDTO } from "../../domain/dto/PatientDTO";

import { API_ROUTES } from "@/shared/utils/apiRoutes";


export function createPatientsRepository(http: HttpClient): PatientRepository {
  return {
    async getAllPatients(signal?: AbortSignal) {
      const dto = await http.request<ApiResponse<PatientResponseDTO[]>>({
        url: API_ROUTES.PATIENT_GET_ALL,
        method: "GET",
        withCredentials: false,
        timeoutMs: 15_000,
        signal,
      });

      return patientsToDomain(dto.data);
    },


    async getPatientById(id, signal) {
      const dto = await http.request<ApiResponse<PatientResponseDTO>>({
        url: `${API_ROUTES.PATIENT_GET_BY_ID}/${id}`,
        method: "GET",
        signal,
      });

      return createPatientToDomain(dto.data);
    },

    async getPatientsPaginated(page, size, signal) {
      const dto = await http.request<ApiResponse<PaginatedPatientsDTO>>({
        url: `${API_ROUTES.PATIENT_GET_PAGINATED}?page=${page}&size=${size}`,
        method: "GET",
        signal,
      });

      return paginatedPatientsToDomain(dto.data);
    },

    async createPatient(nombre: string, apellido: string, fechaNacimiento: string, telefono: number, direccion: string, genero: "M" | "F") {
      const dto = await http.request<
        ApiResponse<PatientResponseDTO>
      >({
        url: API_ROUTES.PATIENT_CREATE,
        method: "POST",
        body: {
          nombre: nombre,
          apellido: apellido,
          fechaNacimiento: fechaNacimiento,
          telefono: telefono,
          direccion: direccion,
          genero: genero
        } satisfies CreatePatientRequestDTO,
      });

      return createPatientToDomain(dto.data);
    },

    async updatePatient(id: number, nombre: string, apellido: string, fechaNacimiento: string, telefono: number, direccion: string, genero: "M" | "F") {
      const dto = await http.request<
        ApiResponse<PatientResponseDTO>
      >({
        url: `${API_ROUTES.PATIENT_PUT}/${id}`,
        method: "PUT",
        body: {
          nombre: nombre,
          apellido: apellido,
          fechaNacimiento: fechaNacimiento,
          telefono: telefono,
          direccion: direccion,
          genero: genero
        } satisfies UpdatePatientRequestDTO,
      });

      return createPatientToDomain(dto.data);
    }
  };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const patientsRepository: PatientRepository =
  createPatientsRepository(httpClient);