import { useQuery } from "@tanstack/react-query";
import { medicationRepository } from "@/modules/appointments/infrastructure/repositories/MedicationRepositoryImpl";

export const useGetAllMedications = () => {
  return useQuery({
    queryKey: ["medications"],
    queryFn: async ({ signal }) => {
      return await medicationRepository.getAllMedications(signal);
    },
  });
};