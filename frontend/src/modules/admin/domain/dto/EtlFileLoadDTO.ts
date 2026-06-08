import type { EtlLoadTypes } from "../../types/EtlTypes"
export type PutEtlFileRequestDTO = {
    file: File;
    loadType: EtlLoadTypes;
}
export type PutEtlFileResponseDTO = {
    fileName: string;
    path: string;
}