import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesRepository } from "@/modules/admin/infrastructure/repositories/RolesRepositoryImpl";
import type { CreateRoleParams } from "../../types/AdminTypes";

interface PutRoleParams {
  edit: boolean;
  params: CreateRoleParams;
}

export const usePutRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ edit, params }: PutRoleParams) =>
      edit
        ? rolesRepository.updateRole(
            params.roleId,
            params.roleName,
            params.parentRoleId,
            params.permissions
          )
        : rolesRepository.createRole(
            params.roleName,
            params.parentRoleId,
            params.permissions
          ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};