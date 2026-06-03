import { usePaginatedTable } from "@/shared/hooks/usePaginatedTable";
import { permissionsRepository } from "@/modules/admin/infrastructure/repositories/PermissionsRepositoryImpl";
import type { Permission } from "@/modules/admin/domain/entities/Permission";


export const useGetPermissionsPaginated = (page: number, size: number) => {
  return usePaginatedTable<Permission>(
    "permissions",
    page,
    size,
    ({ page, size, signal }) =>
      permissionsRepository.getPermissionsPaginated(page, size, signal)
  );
};