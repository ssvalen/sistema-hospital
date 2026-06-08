import { useQuery } from "@tanstack/react-query";
import { hospitalitationRepository } from "@/modules/hospital/infrastructure/repositories/HospitalitationRepositoryImpl";

export const useHospitalitationById = (id: number) => {
  return useQuery({
    queryKey: ["hospitalitations"],
    queryFn: async ({ signal }) => {
      return await hospitalitationRepository.getHospitalitationById(id, signal);
    },
    refetchOnWindowFocus: false
  });
};