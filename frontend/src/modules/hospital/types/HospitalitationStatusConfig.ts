import {
    HOSPITALITATION_STATUS,
    type HospitalitationStatus,
} from "./HospitalitationStatus";

export const HOSPITALITATION_STATUS_CONFIG: Record<
    HospitalitationStatus,
    {
        label: string;
        className: string;
        color: string;
    }
> = {
    [HOSPITALITATION_STATUS.INTERNADO]: {
        label: "Internado",
        className: "bg-blue-100 text-blue-700",
        color: "blue",
    },

    [HOSPITALITATION_STATUS.EGRESADO]: {
        label: "Egresado",
        className: "bg-emerald-100 text-emerald-700",
        color: "green",
    },

    [HOSPITALITATION_STATUS.TRASLADADO]: {
        label: "Trasladado",
        className: "bg-amber-100 text-amber-700",
        color: "yellow",
    },
};