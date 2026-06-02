import type { AppointmentRepository } from "../interfaces/AppointmentRepository";
import type { TreatmentRepository } from "../interfaces/TreatmentRepository";
import type { MedicationRepository } from "../interfaces/MedicationRepository";
import type { Treatment } from "../../domain/entities/Treatment";

type CreateTreatmentParams = {
    appointmentId: number;
    description: string;
    from: string;
    to: string;

    medications: {
        medicationId: number;
        dosage: string;
        quantity: number;
    }[];
};

export const createTreatment = async (
    params: CreateTreatmentParams,
    treatmentRepo: TreatmentRepository,
    medicationRepo: MedicationRepository,

    signal?: AbortSignal
) => {

    const treatment = await treatmentRepo.createTreatment(
        params.appointmentId,
        params.description,
        params.from,
        params.to,
        signal
    );

    for (const medication of params.medications) {
        await medicationRepo.addMedicationToTreatment(
            treatment.id,
            medication.medicationId,
            medication.dosage,
            medication.quantity,
            signal
        );
    }

    return treatment;
};