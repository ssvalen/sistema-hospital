export type AppointmentStatus =
  | "scheduled"
  | "cancelled"
  | "completed";

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  start: string;
  end: string;
  reason: string;
  status: AppointmentStatus;
};