import { usePaginatedTable } from "@/shared/hooks/usePaginatedTable";
import type { Medicine } from "../../domain/entities/Medicine";
import { medicineRepository } from "../../infrastructure/repositories/MedicineRepositoryImpl";

export const useMedicinePaginated = (page: number, size: number) => {
  return usePaginatedTable<Medicine>(
    "medicine",
    page,
    size,
    ({ page, size, signal }) =>
      medicineRepository.getMedicinesPaginated(page, size, signal)
  );
};