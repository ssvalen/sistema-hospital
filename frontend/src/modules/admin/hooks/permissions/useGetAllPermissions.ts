import { useQuery } from "@tanstack/react-query";
import { permissionsRepository } from "@/modules/admin/infrastructure/repositories/PermissionsRepositoryImpl";

export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async ({ signal }) => {
      return await permissionsRepository.getAllPermissions(signal);
    },
  });
};