import type { Hospitalitation } from "../../domain/entities/Hospitalitation";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
import type {
    HospitalitationRequestParams,
    HospitalitationEgressRequestParams
} from "../../types/HospitalitationTypes";

export interface HospitalitationRepository {
    getAllHospitalitations(signal?: AbortSignal): Promise<Hospitalitation[]>;
    getHospitalitationsPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Hospitalitation>>;
    getHospitalitationById(hospitalitationId: number, signal?: AbortSignal): Promise<Hospitalitation>;
    getHospitalitationsByPatient(patientId: number, signal?: AbortSignal): Promise<Hospitalitation[]>;
    ingressHospitalitation(params: HospitalitationRequestParams, signal?: AbortSignal): Promise<Hospitalitation>;
    egressHospitalitation(params: HospitalitationEgressRequestParams, signal?: AbortSignal): Promise<Hospitalitation>;
}
