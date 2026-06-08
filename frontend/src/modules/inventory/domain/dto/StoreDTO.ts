import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";



export type StoreRequestDTO = {
    nombreBodega: string;
    ubicacion: string;
};


export type StoreResponseDTO = {
    idBodega: number;
    nombreBodega: string;
    ubicacion: string;
    cantidadProductos: number;
};

export type PaginatedStoresDTO = PaginatedResponse<StoreResponseDTO>;

