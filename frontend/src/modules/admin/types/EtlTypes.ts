export type EtlLoadTypes = "PATIENTS" | "INVENTORY";

export type EtlLoadRequestParams = {
    file: File;
    loadType: EtlLoadTypes
}