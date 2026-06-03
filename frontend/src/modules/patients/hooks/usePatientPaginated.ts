import { usePaginatedTable } from "@/shared/hooks/usePaginatedTable";
import type { Patient } from "@/modules/patients/domain/entities/Patient";
import { patientsRepository } from "../infrastructure/repositories/PatientRepositoryImpl";


export const usePatientPaginated = (page: number, size: number) => {
  return usePaginatedTable<Patient>(
    "patients",
    page,
    size,
    ({ page, size, signal }) =>
      patientsRepository.getPatientsPaginated(page, size, signal)
  );
};