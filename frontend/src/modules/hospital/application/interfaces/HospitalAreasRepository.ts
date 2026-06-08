import type { HospitalArea } from "../../domain/entities/HospitalArea";
import type { HospitalAreaRequestParams } from "../../types/HospitalAreaTypes";

export interface HospitalAreasRepository {
    getAllAreas(signal?: AbortSignal): Promise<HospitalArea[]>;
    createArea(params: HospitalAreaRequestParams, signal?: AbortSignal): Promise<HospitalArea>;
    updateArea(params: HospitalAreaRequestParams, signal?: AbortSignal): Promise<HospitalArea>;
}
