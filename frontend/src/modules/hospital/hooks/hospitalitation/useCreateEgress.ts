import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hospitalitationRepository } from "@/modules/hospital/infrastructure/repositories/HospitalitationRepositoryImpl";
import type { HospitalitationEgressRequestParams } from "../../types/HospitalitationTypes";


export const useCreateEgress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: HospitalitationEgressRequestParams) =>
            hospitalitationRepository.egressHospitalitation(params),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["egress"]
            });
        }
    });
};