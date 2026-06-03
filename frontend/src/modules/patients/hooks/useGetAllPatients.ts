import { useQuery } from "@tanstack/react-query";
import { patientsRepository } from "../infrastructure/repositories/PatientRepositoryImpl";

export const useGetAllPatients = (enabled = false) => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async ({ signal }) => {
      return await patientsRepository.getAllPatients(signal)
    },
    enabled
  });
};