import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesRepository } from "@/modules/admin/infrastructure/repositories/RolesRepositoryImpl";

export const useRemoveRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (roleId:number) => rolesRepository.removeRole(roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
};