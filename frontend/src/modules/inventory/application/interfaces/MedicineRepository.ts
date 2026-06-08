import type { Medicine } from "../../domain/entities/Medicine";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
import type { RequestMedicineQueryParams } from "../../types/MedicineTypes";

export interface MedicineRepository {

    getMedicinesPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Medicine>>;

    getMedicineById(medicineId: number, signal?: AbortSignal): Promise<Medicine>;

    createMedicine(params: RequestMedicineQueryParams, signal?: AbortSignal): Promise<Medicine>;
    updateMedicine(params: RequestMedicineQueryParams, signal?: AbortSignal): Promise<Medicine>;

}
