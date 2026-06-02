import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
import type { TreatmentMedicationResponseDTO } from "./MedicationDTO";


export type TreatmentRequestDTO = {
    fechaHoraCita: string;
    estado: string;
    idPaciente: number;
    idMedico: number;
};

export type TreatmentResponseDTO = {
    idTratamiento: number;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;

    idCita: number;
    citaFechaHora: string;
    citaEstado: string;

    idPaciente: number;
    pacienteNombre: string;
    pacienteApellido: string;
    pacienteTelefono: string;

    idMedico: number;
    medicoNombre: string;
    medicoApellido: string;
    medicoEspecialidad: string;

    medicamentos: TreatmentMedicationResponseDTO[];
};

export type PaginatedTreatmentsDTO =  PaginatedResponse<TreatmentResponseDTO>;

export type CreateTreatmentRequestDTO = {
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    idCita: number;
};