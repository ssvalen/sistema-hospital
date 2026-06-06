import { useQuery } from "@tanstack/react-query";
import { hospitalitationRepository } from "@/modules/hospital/infrastructure/repositories/HospitalitationRepositoryImpl";

export const useHospitalitations = (enabled = true) => {
  return useQuery({
    queryKey: ["allHospitalitations"],
    queryFn: async ({ signal }) => {
      return await hospitalitationRepository.getAllHospitalitations(signal);
    },
    enabled,
    refetchOnWindowFocus: false
  });
};