import { useQuery } from "@tanstack/react-query";
import { hospitalAreaRepository } from "@/modules/hospital/infrastructure/repositories/HospitalAreaRepositoryImpl";

export const useHospitalAreas = (enabled = true) => {
  return useQuery({
    queryKey: ["hospital_area"],
    queryFn: async ({ signal }) => {
      return await hospitalAreaRepository.getAllAreas(signal);
    },
    enabled,
    refetchOnWindowFocus: false
  });
};