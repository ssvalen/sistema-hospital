export const HOSPITALITATION_ACTIONS = {
    VIEW: "VIEW",
    DISCHARGE: "DISCHARGE",
    TRANSFER: "TRANSFER",
} as const;

export type HospitalitationAction =
    keyof typeof HOSPITALITATION_ACTIONS;