import { useQuery } from "@tanstack/react-query";
import { userRepository } from "@/modules/admin/infrastructure/repositories/UserRepositoryImpl";

export const useRolesByUser = (userId?: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user-roles", userId],
    enabled: !!userId && options?.enabled !== false,
    queryFn: ({ signal }) => userRepository.getUserRoles(userId!, signal),
  });
};