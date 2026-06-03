import type { Medication } from "../../domain/entities/Medication";
import type { TreatmentMedicationResponseDTO, TreatmentMedicationsResponseDTO } from "../../domain/dto/MedicationDTO";

export function medicationToDomain(
    dto: TreatmentMedicationResponseDTO
): Medication {
    return {
        id: dto.idMedicamento,
        commercialName: dto.nombreComercial,
        activeIngredient: dto.principioActivo,
        stock: dto.stockTotal,
        medicalUnit: dto.unidadMedida,
    };
}

export function medicationsToDomain(
    dtos: TreatmentMedicationResponseDTO[]
): Medication[] {
    return dtos.map(medicationToDomain);
}

// export type Medication = {
//     id: number;
//     commercialName: string;
//     activeIngredient: string;
//     stock: number;
//     medicalUnit: string;
//     dosage?: string;
// }
export function treatmentMedicationToDomain(
    dto: TreatmentMedicationsResponseDTO
): Medication {
    return {
        id: dto.idMedicamento,
        commercialName: dto.nombreComercial,
        activeIngredient: dto.principioActivo,
        quantity: dto.cantidad,
        medicalUnit: dto.unidadMedida,
        dosage: dto.dosis,
    }
}

export function treatmentsMedicationToDomain(
    dtos: TreatmentMedicationsResponseDTO[]
): Medication[] {
    return dtos.map(treatmentMedicationToDomain);
}