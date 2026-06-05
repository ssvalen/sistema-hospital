import type { EtlLoadTypes } from "../../types/EtlTypes";

export type EtlFile = {
    file: BinaryType;
    loadType: EtlLoadTypes;
}