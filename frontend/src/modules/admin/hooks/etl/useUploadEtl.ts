import { useMutation } from "@tanstack/react-query";
import { etlRepository } from "../../infrastructure/repositories/EtlRepositoryImpl";

import type { EtlLoadRequestParams } from "../../types/EtlTypes";

export const useUploadEtl = () => {

    return useMutation({
        mutationFn: async (params: EtlLoadRequestParams) => {

            return await etlRepository.putFile({
                file: params.file,
                loadType: params.loadType
            });
        }
    });

};