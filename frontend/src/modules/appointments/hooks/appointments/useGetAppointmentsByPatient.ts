import { useQuery } from "@tanstack/react-query";

import { treatmentRepository } from "../../infrastructure/repositories/TreatmentRepositoryImpl";

export const useGetAppointmentsByPatient = (
    patientId?: number
) => {
    return useQuery({
        queryKey: ["appointments", "patient", patientId],

        queryFn: ({ signal }) =>
            treatmentRepository.getTreatmentsByPatient(
                patientId!,
                signal
            ),

        enabled: !!patientId,
    });
};