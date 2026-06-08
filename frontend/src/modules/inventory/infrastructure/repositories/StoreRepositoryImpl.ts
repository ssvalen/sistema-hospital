import type { HttpClient } from "@/shared/http/HttpClient";
import type { ApiResponse } from "@/shared/http/ApiResponse";
import { createApiClient } from "@/shared/http/createApiClient";
import type { RequestStoreQueryParams } from "../../types/StoreTypes";

import type { StoreRepository } from "../../application/interfaces/StoreRepository";
import { paginatedStoresToDomain, storesToDomain, storeToDomain } from "../mappers/storeMapper";
import type {
    PaginatedStoresDTO,
    StoreResponseDTO,
    StoreRequestDTO
} from "../../domain/dto/StoreDTO";

import { API_ROUTES } from "@/shared/utils/apiRoutes";


export function createStoresRepository(http: HttpClient): StoreRepository {
    return {

        async getStoreById(id, signal) {
            const dto = await http.request<ApiResponse<StoreResponseDTO>>({
                url: `${API_ROUTES.STORE_ENDPOINT}/${id}`,
                method: "GET",
                signal,
            });

            return storeToDomain(dto.data);
        },

        async getStoresPaginated(page, size, signal) {
            const dto = await http.request<ApiResponse<PaginatedStoresDTO>>({
                url: `${API_ROUTES.STORE_PAGINATED}?page=${page}&size=${size}`,
                method: "GET",
                signal,
            });

            return paginatedStoresToDomain(dto.data);
        },

        async createStore(params: RequestStoreQueryParams, signal) {

            const body: StoreRequestDTO = {
                nombreBodega: params.storeName,
                ubicacion: params.storeAddress
            }

            const dto = await http.request<ApiResponse<StoreResponseDTO>>({
                url: API_ROUTES.STORE_ENDPOINT,
                method: "POST",
                body,
                signal
            });

            return storeToDomain(dto.data);
        },

        async updateStore(params: RequestStoreQueryParams, signal) {

            const body: StoreRequestDTO = {
                nombreBodega: params.storeName,
                ubicacion: params.storeAddress
            }

            const dto = await http.request<ApiResponse<StoreResponseDTO>>({
                url: `${API_ROUTES.STORE_ENDPOINT}/${params.id}`,
                method: "PUT",
                body,
                signal
            });

            return storeToDomain(dto.data);
        },
    };
}

const httpClient = createApiClient(import.meta.env.VITE_API_BACKEND_URL ?? "");

export const storeRepository: StoreRepository =
    createStoresRepository(httpClient);