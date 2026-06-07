
import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";

import type { EtlRepository } from "../../application/interfaces/EtlRepository";

import { API_ROUTES } from "@/shared/utils/apiRoutes";
import type { PutEtlFileRequestDTO, PutEtlFileResponseDTO } from "../../domain/dto/EtlFileLoadDTO";

export function createEtlRepository(http: HttpClient): EtlRepository {
    return {
        async putFile(params, signal) {

            const formData = new FormData();

            formData.append("file", params.file);
            formData.append("loadType", params.loadType);

            const dto = await http.request<ApiResponse<PutEtlFileResponseDTO>>({
                url: API_ROUTES.ETL_LOAD,
                method: "POST",
                body: formData,
                withCredentials: false,
                timeoutMs: 15_000,
                signal,
            });

           

            return dto.success
            return true
        },
    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const etlRepository: EtlRepository =
    createEtlRepository(httpClient);