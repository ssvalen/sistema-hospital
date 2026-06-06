import { useQuery } from "@tanstack/react-query";
import { rolesRepository } from "@/modules/admin/infrastructure/repositories/RolesRepositoryImpl";

export const useRoleById = (
  id: number,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["roleById", id],

    enabled: Boolean(id) && (options?.enabled ?? true),

    queryFn: ({ signal }) =>
      rolesRepository.getRoleById(id, signal),
  });
};