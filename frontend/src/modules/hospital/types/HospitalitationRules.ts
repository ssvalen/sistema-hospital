import {
    HOSPITALITATION_STATUS,
    type HospitalitationStatus,
} from "./HospitalitationStatus";

export const HOSPITALITATION_RULES: Record<
    HospitalitationStatus,
    readonly string[]
> = {
    [HOSPITALITATION_STATUS.INTERNADO]: [
        "VIEW",
        "DISCHARGE",
        "TRANSFER",
    ],

    [HOSPITALITATION_STATUS.EGRESADO]: [
        "VIEW",
    ],

    [HOSPITALITATION_STATUS.TRASLADADO]: [
        "VIEW",
    ],
};