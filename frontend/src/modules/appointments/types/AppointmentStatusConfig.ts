import { type AppointmentStatus, APPOINTMENT_STATUS } from "./AppointmentStatus";
export const APPOINTMENT_STATUS_CONFIG: Record<
    AppointmentStatus,
    {
        label: string;
        className: string;
        color: string;
    }
> = {
    [APPOINTMENT_STATUS.SCHEDULED]: {
        label: "Programada",
        className: "bg-blue-100 text-blue-700",
        color: "blue",
    },

    [APPOINTMENT_STATUS.COMPLETED]: {
        label: "Completada",
        className: "bg-emerald-100 text-emerald-700",
        color: "green",
    },

    [APPOINTMENT_STATUS.CANCELLED]: {
        label: "Cancelada",
        className: "bg-red-100 text-red-700",
        color: "red",
    },

    [APPOINTMENT_STATUS.RESCHEDULED]: {
        label: "Reprogramada",
        className: "bg-amber-100 text-amber-700",
        color: "yellow",
    },
};