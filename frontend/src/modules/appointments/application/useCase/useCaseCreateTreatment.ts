import type { TreatmentRepository } from "../interfaces/TreatmentRepository";
import type { MedicationRepository } from "../interfaces/MedicationRepository";
import type { AppointmentRepository } from "../interfaces/AppointmentRepository";
import type { CreateTreatmentParams } from "@/modules/appointments/types/AppointmentTypes";

export const createTreatment = async (
    params: CreateTreatmentParams,
    treatmentRepo: TreatmentRepository,
    medicationRepo: MedicationRepository,
    appointmentRepo: AppointmentRepository,
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

    const updateState = await appointmentRepo.updateAppointment(
        params.appointmentId,
        params.patientId,
        params.medicId,
        params.endDate,
        params.appointmentStatus,
        signal
    )

    return treatment;
};