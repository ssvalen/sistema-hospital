import type { Medication } from "./Medication";
import type { AppointmentStatus } from "../../types/AppointmentStatus";

export type Appointment = {
  id: number;
  startDate: string;
  startTime: string;
  status: AppointmentStatus;

  patient: {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
  };

  doctor: {
    id: number;
    firstName: string;
    lastName: string;
    specialty: string;
    fullName: string;
  };

  
};