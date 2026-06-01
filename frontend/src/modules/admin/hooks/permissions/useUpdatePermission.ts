import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionsRepository } from "@/modules/admin/infrastructure/repositories/PermissionsRepositoryImpl";

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; name: string }) =>
      permissionsRepository.updatePermission(vars.id, vars.name),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};