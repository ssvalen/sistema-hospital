import type { Medication } from "../../domain/entities/Medication";
import type { TreatmentMedicationResponseDTO } from "../../domain/dto/MedicationDTO";

export function medicationToDomain(
    dto: TreatmentMedicationResponseDTO
): Medication {
    return {
        id: dto.idMedicamento,
        commercialName: dto.nombreComercial,
        activeIngredient: dto.principioActivo,
        dosage: dto.dosis,
        stock: dto.cantidad,
        medicalUnit: dto.unidadMedida,
    };
}

export function medicationsToDomain(
    dtos: TreatmentMedicationResponseDTO[]
): Medication[] {
    return dtos.map(medicationToDomain);
}