export type TreatmentMedicationResponseDTO = {
  idMedicamento: number;
  nombreComercial: string;
  principioActivo: string;
  unidadMedida: string;
  stockTotal: number;
};

export type TreatmentMedicationsResponseDTO = {
  idMedicamento: number;
  nombreComercial: string;
  principioActivo: string;
  unidadMedida: string;
  dosis: string;
  cantidad: number;
};

export type CreateTreatmentMedicationRequestDTO = {
  idTratamiento: number;
  idMedicamento: number;
  dosis: string;
  cantidad: number;
};