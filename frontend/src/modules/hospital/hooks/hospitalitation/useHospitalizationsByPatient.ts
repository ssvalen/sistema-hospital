import { useQuery } from "@tanstack/react-query";
import { hospitalitationRepository } from "@/modules/hospital/infrastructure/repositories/HospitalitationRepositoryImpl";

export const useHospitalizationsByPatient = (id: number) => {
  return useQuery({
    queryKey: ["hospitalitationsByPatient", id],
    queryFn: async ({ signal }) => {
      return await hospitalitationRepository.getHospitalitationsByPatient(id, signal);
    },
    initialData: [],
    enabled: !!id
  });
};