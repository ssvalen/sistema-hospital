import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionsRepository } from "@/modules/admin/infrastructure/repositories/PermissionsRepositoryImpl";

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) =>
      permissionsRepository.createPermission(name),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });
};