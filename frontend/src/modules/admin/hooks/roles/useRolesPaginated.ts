import { usePaginatedTable } from "@/shared/hooks/usePaginatedTable";
import {rolesRepository} from "@/modules/admin/infrastructure/repositories/RolesRepositoryImpl";
import type { Role } from "@/modules/admin/domain/entities/Role";


export const useRolesPaginated = (page: number, size: number) => {
  return usePaginatedTable<Role>(
    "roles",
    page,
    size,
    ({ page, size, signal }) =>
      rolesRepository.getRolesPaginated(page, size, signal)
  );
};