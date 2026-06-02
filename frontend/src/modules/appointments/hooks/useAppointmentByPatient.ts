import { useQuery } from "@tanstack/react-query";
import { appointmentRepository } from "../infrastructure/repositories/AppointmentRepositoryImpl";

export const useAppointmentByPatient = (
  id: number,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["appointment", "patient", id],

    enabled: Boolean(id) && (options?.enabled ?? true),

    queryFn: ({ signal }) =>
      appointmentRepository.getAppointmentByPatient(
        id,
        signal
      ),
  });
};