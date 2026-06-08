import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicineRepository } from "../../infrastructure/repositories/MedicineRepositoryImpl";
import type { RequestMedicineQueryParams } from "../../types/MedicineTypes";

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RequestMedicineQueryParams) => medicineRepository.updateMedicine(params),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicine"] });
    },
  });
};