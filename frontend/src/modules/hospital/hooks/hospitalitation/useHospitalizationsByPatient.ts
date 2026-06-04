import { useQuery } from "@tanstack/react-query";
import { hospitalitationRepository } from "@/modules/hospital/infrastructure/repositories/HospitalitationRepositoryImpl";

export const useHospitalizationsByPatient = (id: number) => {
  return useQuery({
    queryKey: ["hospitalitations", id],
    queryFn: async ({ signal }) => {
      return await hospitalitationRepository.getHospitalitationsByPatient(id, signal);
    },
    refetchOnWindowFocus: false,
    initialData: [],
    enabled: !!id
  });
};