import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeRepository } from "../../infrastructure/repositories/StoreRepositoryImpl";
import type { RequestStoreQueryParams } from "../../types/StoreTypes";

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RequestStoreQueryParams) => storeRepository.updateStore(params),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
  });
};