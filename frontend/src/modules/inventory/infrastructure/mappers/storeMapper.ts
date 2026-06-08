import type { Store } from "../../domain/entities/Store";
import type { PaginatedStoresDTO, StoreResponseDTO} from "../../domain/dto/StoreDTO";
import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

export function storeToDomain(dto: StoreResponseDTO): Store {
  return {
    id: dto.idBodega,
    name: dto.nombreBodega,
    address: dto.ubicacion,
    totalProducts: dto.cantidadProductos
  };
}

export function paginatedStoresToDomain( dto: PaginatedStoresDTO) {
  return paginatedMapper(dto, storeToDomain);
}

export function storesToDomain(
  dtos: StoreResponseDTO[]
): Store[] {
  return dtos.map(storeToDomain);
}
