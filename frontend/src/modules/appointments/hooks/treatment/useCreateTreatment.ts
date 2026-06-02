import { useMutation, useQueryClient} from "@tanstack/react-query";

import { createTreatment } from "../../application/useCase/useCaseCreateTreatment";

import { treatmentRepository } from "../../infrastructure/repositories/TreatmentRepositoryImpl";
import { medicationRepository } from "../../infrastructure/repositories/MedicationRepositoryImpl";

import type { CreateTreatmentParams } from "../../types/AppointmentTypes";

export const useCreateTreatment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: CreateTreatmentParams) =>
            createTreatment(
                params,
                treatmentRepository,
                medicationRepository
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["treatments"],
            });

            queryClient.invalidateQueries({
                queryKey: ["appointments"],
            });
        },
    });
};