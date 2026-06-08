import { useQuery } from "@tanstack/react-query";
import { doctorRepository } from "@/modules/hospital/infrastructure/repositories/DoctorRepositoryImpl";

export const useGetAllDoctors = (enabled = true) => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async ({ signal }) => {
      return await doctorRepository.getAllDoctors(signal);
    },
    enabled
  });
};