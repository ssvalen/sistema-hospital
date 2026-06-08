export type EtlLoadTypes = "PACIENTES" | "INVENTARIO";

export type EtlLoadRequestParams = {
    file: File;
    loadType: EtlLoadTypes
}