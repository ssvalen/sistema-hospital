import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";



export type MedicineRequestDTO = {
  nombreComercial: string;
  principioActivo: string;
  unidadMedida: string;
};


export type MedicineResponseDTO = {
  idMedicamento: number;
  nombreComercial: string;
  principioActivo: string;
  unidadMedida: string;
  cantidadTratamientos: number;
  stockTotal: number;
};

export type PaginatedMedicinesDTO = PaginatedResponse<MedicineResponseDTO>;

