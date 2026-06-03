import { useQuery } from "@tanstack/react-query";
import { permissionsRepository } from "@/modules/admin/infrastructure/repositories/PermissionsRepositoryImpl";

export const useGetRolePermissions = (
  roleId: number,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["role-permissions", roleId],

    enabled:
      options?.enabled !== undefined
        ? options.enabled
        : true,

    queryFn: async ({ signal }) => {
      return await permissionsRepository.getPermissionsByRole(
        roleId,
        signal
      );
    },
  });
};