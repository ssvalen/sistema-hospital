import { useQuery } from "@tanstack/react-query";
import { medicineRepository } from "../../infrastructure/repositories/MedicineRepositoryImpl";

export const useMedicineById = (
  id?: number,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["medicine", id],

    enabled: Boolean(id) && (options?.enabled ?? true),

    queryFn: async ({ signal }) => {
      return medicineRepository.getMedicineById(
        id as number,
        signal
      );
    },
  });
};