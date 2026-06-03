import type { Medication } from "../../domain/entities/Medication";


export interface MedicationRepository {
    getAllMedications(signal?: AbortSignal): Promise<Medication[]>;
    // trae los medicamentos de un tratamiento
    getMedicationsByTreatment(treatmentId: number, signal?: AbortSignal): Promise<Medication[]>;

    addMedicationToTreatment(
        treatmentId: number,
        medicId: number,
        dosage: string,
        quantity: number,
        signal?: AbortSignal
    ): Promise<Medication>;

    updateMedicationToTreatment(
        medicationTreatmentId: number,
        treatmentId: number,
        medicId: number,
        dosage: string,
        quantity: number,
        signal?: AbortSignal
    ): Promise<Medication>;

}
