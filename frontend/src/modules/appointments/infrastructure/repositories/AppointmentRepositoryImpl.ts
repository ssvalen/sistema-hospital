import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type {
    AppointmentRequestDTO,
    AppointmentResponseDTO,
    PaginatedAppointmentsDTO,
    CreateAppointmentRequestDTO
} from "../../domain/dto/AppointmentDTO";

import type { AppointmentRepository } from "../../application/interfaces/AppointmentRepository";

import {
    appointmentToDomain,
    appointmentsToDomain,
    paginatedAppointmentsToDomain
} from "../mappers/appointmentsMapper";
import { API_ROUTES } from "@/shared/utils/apiRoutes";

export function createAppointmentRepository(http: HttpClient): AppointmentRepository {
    return {
        async getAllAppointments(signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<AppointmentResponseDTO[]>>({
                url: API_ROUTES.APPOINTMENT_GET_ALL,
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return appointmentsToDomain(dto.data);
        },

        async getAppointmentsPaginated(page, size, signal) {
            const dto = await http.request<ApiResponse<PaginatedAppointmentsDTO>>({
                url: `${API_ROUTES.APPOINTMENT_GET_PAGINATED}?page=${page}&size=${size}`,
                method: "GET",
                signal,
            });

            return paginatedAppointmentsToDomain(dto.data);
        },

        async getAppointmentsByMedic(medicId: number, signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<AppointmentResponseDTO[]>>({
                url: API_ROUTES.APPOINTMENT_GET_BY_MEDIC(medicId),
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return appointmentsToDomain(dto.data);
        },

        async getAppointmentsByPatient(patientId: number, signal?: AbortSignal) {
            const dto = await http.request<ApiResponse<AppointmentResponseDTO[]>>({
                url: API_ROUTES.APPOINTMENT_GET_BY_MEDIC(patientId),
                method: "GET",
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return appointmentsToDomain(dto.data);
        },

        async createAppointment(
            patientId: number,
            medicId: number,
            appointmentDate: string,
            appointmentStatus: string,
            signal?: AbortSignal) {
            const body: CreateAppointmentRequestDTO = {
                idPaciente: patientId,
                idMedico: medicId,
                estado: appointmentStatus,
                fechaHora: appointmentDate
            };

            const dto = await http.request<ApiResponse<AppointmentResponseDTO>>({
                url: API_ROUTES.APPOINTMENT_CREATE,
                method: "POST",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return appointmentToDomain(dto.data);
        },

        async updateAppointment(
            appointmentId: number,
            patientId: number,
            medicId: number,
            appointmentDate: string,
            appointmentStatus: string,
            signal?: AbortSignal) {
            const body: CreateAppointmentRequestDTO = {
                idPaciente: patientId,
                idMedico: medicId,
                estado: appointmentStatus,
                fechaHora: appointmentDate
            };

            const dto = await http.request<ApiResponse<AppointmentResponseDTO>>({
                url: API_ROUTES.APPOINTMENT_UPDATE(appointmentId),
                method: "POST",
                body,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

            return appointmentToDomain(dto.data);
        },

    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const appointmentRepository: AppointmentRepository =
    createAppointmentRepository(httpClient);