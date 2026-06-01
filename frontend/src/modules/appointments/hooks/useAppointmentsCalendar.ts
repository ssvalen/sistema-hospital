import { useQuery } from "@tanstack/react-query";
import { appointmentRepository } from "../infrastructure/repositories/AppointmentRepositoryImpl";

type UseAppointmentsCalendarParams = {
  canViewAll: boolean;
  medicId?: number;
};

export function useAppointmentsCalendar({
  canViewAll,
  medicId,
}: UseAppointmentsCalendarParams) {
  return useQuery({
    queryKey: ["appointments", "calendar", canViewAll, medicId],

    queryFn: ({ signal }) => {
      if (canViewAll) {
        return appointmentRepository.getAllAppointments(signal);
      }

      if (!medicId) {
        return Promise.resolve([]);
      }

      return appointmentRepository.getAppointmentsByMedic(medicId, signal);
    },

    enabled: canViewAll || !!medicId,
  });
}