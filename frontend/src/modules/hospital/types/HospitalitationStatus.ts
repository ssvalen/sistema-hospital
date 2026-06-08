export const HOSPITALITATION_STATUS = {
    INTERNADO: "INTERNADO",
    EGRESADO: "EGRESADO",
    TRASLADADO: "TRASLADADO",
} as const;

export type HospitalitationStatus =
    (typeof HOSPITALITATION_STATUS)[keyof typeof HOSPITALITATION_STATUS];