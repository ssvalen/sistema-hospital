import type { Medicine } from "../../domain/entities/Medicine";
import type { PaginatedMedicinesDTO, MedicineResponseDTO} from "../../domain/dto/MedicineDTO";
import { paginatedMapper } from "@/shared/infrastructure/mappers/paginatedMapper";

export function medicineToDomain(dto: MedicineResponseDTO): Medicine {
  return {
    id: dto.idMedicamento,
    commercialName: dto.nombreComercial,
    principalActive: dto.principioActivo,
    unit: dto.unidadMedida,
    stock: dto.stockTotal,
    treatments: dto.cantidadTratamientos
  };
}

export function paginatedMedicinesToDomain( dto: PaginatedMedicinesDTO) {
  return paginatedMapper(dto, medicineToDomain);
}

export function medicinesToDomain(
  dtos: MedicineResponseDTO[]
): Medicine[] {
  return dtos.map(medicineToDomain);
}
