import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hospitalitationRepository } from "@/modules/hospital/infrastructure/repositories/HospitalitationRepositoryImpl";
import type { HospitalitationRequestParams } from "../../types/HospitalitationTypes";


export const useCreateIngress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: HospitalitationRequestParams) =>
            hospitalitationRepository.ingressHospitalitation(params),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["ingress"]
            });
        }
    });
};