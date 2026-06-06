import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionsRepository } from "@/modules/admin/infrastructure/repositories/PermissionsRepositoryImpl";

export const useRemovePermission = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (permissionId :number) => permissionsRepository.removePermission(permissionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["permissions"] });
        },
    });
};