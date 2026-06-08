import { useQuery } from "@tanstack/react-query";
import { storeRepository } from "../../infrastructure/repositories/StoreRepositoryImpl";
export const useStoreById = (
  id?: number,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["store", id],

    enabled: Boolean(id) && (options?.enabled ?? true),

    queryFn: async ({ signal }) => {
      return storeRepository.getStoreById(
        id as number,
        signal
      );
    },
  });
};