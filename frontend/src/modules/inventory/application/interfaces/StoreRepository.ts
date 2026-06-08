import type { Store } from "../../domain/entities/Store";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";
import type { RequestStoreQueryParams } from "../../types/StoreTypes";

export interface StoreRepository {

    getStoresPaginated(
        page: number,
        size: number,
        signal?: AbortSignal
    ): Promise<PaginatedResponse<Store>>;

    getStoreById(StoreId: number, signal?: AbortSignal): Promise<Store>;

    createStore(params: RequestStoreQueryParams, signal?: AbortSignal): Promise<Store>;
    updateStore(params: RequestStoreQueryParams, signal?: AbortSignal): Promise<Store>;

}
