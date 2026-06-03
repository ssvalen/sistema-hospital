import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsRepository } from "../infrastructure/repositories/PatientRepositoryImpl";

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientData: any) =>
      patientsRepository.createPatient(
        patientData.nombre,
        patientData.apellido,
        patientData.fechaNacimiento,
        patientData.telefono,
        patientData.direccion,
        patientData.genero
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};