import { useQuery } from "@tanstack/react-query";
import { rolesRepository } from "@/modules/admin/infrastructure/repositories/RolesRepositoryImpl";

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async ({ signal }) => {

      return await rolesRepository.getAllRoles(signal);

    },
  });
};