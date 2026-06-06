export const APPOINTMENT_ACTIONS = {
  EDIT: "EDIT",
  CANCEL: "CANCEL",
  ATTEND: "ATTEND",
} as const;

export type AppointmentAction =
  keyof typeof APPOINTMENT_ACTIONS;