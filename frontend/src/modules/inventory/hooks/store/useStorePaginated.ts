import { usePaginatedTable } from "@/shared/hooks/usePaginatedTable";
import type { Store } from "../../domain/entities/Store";
import { storeRepository } from "../../infrastructure/repositories/StoreRepositoryImpl";

export const useStorePaginated = (page: number, size: number) => {
  return usePaginatedTable<Store>(
    "store",
    page,
    size,
    ({ page, size, signal }) =>
      storeRepository.getStoresPaginated(page, size, signal)
  );
};