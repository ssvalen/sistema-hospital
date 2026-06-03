import { useQuery } from "@tanstack/react-query";
import { patientsRepository } from "../infrastructure/repositories/PatientRepositoryImpl";

export const usePatientById = (
  id?: number,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["patient", id],

    enabled: Boolean(id) && (options?.enabled ?? true),

    queryFn: async ({ signal }) => {
      return patientsRepository.getPatientById(
        id as number,
        signal
      );
    },
  });
};