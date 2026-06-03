import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsRepository } from "../infrastructure/repositories/PatientRepositoryImpl";

export const useUpdatePatient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (patientData: any) =>
            patientsRepository.updatePatient(
                patientData.id,
                patientData.nombre,
                patientData.apellido,
                patientData.fechaNacimiento,
                patientData.telefono,
                patientData.direccion,
                patientData.genero
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            queryClient.invalidateQueries({ queryKey: ["patient"] });
        },
    });
};