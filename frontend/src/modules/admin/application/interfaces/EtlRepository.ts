import type { EtlLoadRequestParams } from "../../types/EtlTypes"

export interface EtlRepository {
    putFile(params: EtlLoadRequestParams, signal?: AbortSignal): Promise<boolean>;
}
