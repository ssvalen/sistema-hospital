
import type { HospitalitationStatus } from "../../types/HospitalitationStatus";
export type Hospitalitation = {
    id: number;
    status: boolean;
    hospitalitation: {
        motiveIngress: string;
        motiveEgress: string;
        observations: string;
        startDate: string;
        endDate?: string;
        status: HospitalitationStatus;
        // status: "INTERNADO" | "EGRESADO" | "TRASLADADO";
    }
    hospitalArea: {
        id: number;
        name: string;
    }
    patient: {
        id: number;
        name: string;
        lastname: string;
        fullname: string;
    }
}