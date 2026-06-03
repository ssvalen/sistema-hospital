import {
  APPOINTMENT_STATUS,
  type AppointmentStatus,
} from "../types/AppointmentStatus";

export const APPOINTMENT_RULES: Record<
  AppointmentStatus,
  readonly string[]
> = {
  [APPOINTMENT_STATUS.SCHEDULED]: [
    "EDIT",
    "CANCEL",
    "ATTEND",
  ],

  [APPOINTMENT_STATUS.RESCHEDULED]: [
    "EDIT",
    "CANCEL",
    "ATTEND",
  ],

  [APPOINTMENT_STATUS.COMPLETED]: [],

  [APPOINTMENT_STATUS.CANCELLED]: [],
};