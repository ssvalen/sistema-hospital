import { usePaginatedTable } from "@/shared/hooks/usePaginatedTable";
import { doctorRepository } from "@/modules/hospital/infrastructure/repositories/DoctorRepositoryImpl";
import type { Doctor } from "@/modules/hospital/domain/entities/Doctor";


export const useDoctorPaginated = (page: number, size: number) => {
  return usePaginatedTable<Doctor>(
    "doctors",
    page,
    size,
    ({ page, size, signal }) =>
      doctorRepository.getDoctorsPaginated(page, size, signal)
  );
};