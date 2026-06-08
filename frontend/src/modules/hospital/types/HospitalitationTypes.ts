
export type HospitalitationRequestParams = {
    patientId: number;
    areaId: number;
    motive: string;
    observations: string;
}

export type HospitalitationEgressRequestParams = {
    hospitalitationId: number;
    motive: string;
    status: "INGRESADO" | "EGRESADO",
    observations: string;
}