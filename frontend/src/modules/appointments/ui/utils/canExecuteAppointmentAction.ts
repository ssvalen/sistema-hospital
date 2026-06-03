import {
  APPOINTMENT_ACTIONS,
  type AppointmentAction,
} from "../../types/AppointmentActions";

import {
  APPOINTMENT_RULES,
} from "../../types/AppointmentRules";

import type {
  AppointmentStatus,
} from "../../types/AppointmentStatus";

export const canExecuteAppointmentAction = (
  status: AppointmentStatus,
  action: AppointmentAction
) => {
  return APPOINTMENT_RULES[status].includes(action);
};