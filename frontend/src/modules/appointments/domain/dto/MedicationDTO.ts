export type TreatmentMedicationResponseDTO = {
  id: number;
  idMedicamento: number;
  nombreComercial: string;
  principioActivo: string;
  dosis: string;
  cantidad: number;
  unidadMedida: string;
};

export type CreateTreatmentMedicationRequestDTO = {
  idTratamiento: number;
  idMedicamento: number;
  dosis: string;
  cantidad: number;
};