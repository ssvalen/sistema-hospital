import { useQuery } from "@tanstack/react-query";
import { appointmentRepository } from "@/modules/appointments/infrastructure/repositories/AppointmentRepositoryImpl";
import type { Appointment } from "@/modules/appointments/domain/entities/Appointment";
import type { PaginatedResponse } from "@/shared/types/pagination/PaginatedResponse";

type Params = {
  canViewAll: boolean;
  page: number;
  size: number;
  medicId?: number;
};

export function useAppointmentsTable({
  canViewAll,
  page,
  size,
  medicId,
}: Params) {
  return useQuery<PaginatedResponse<Appointment> | Appointment[]>({
    queryKey: ["appointments", canViewAll, page, size, medicId],

    queryFn: ({ signal }) => {
      if (canViewAll) {
        return appointmentRepository.getAppointmentsPaginated(page,size,signal);
      }

      if (!medicId) {
        throw new Error("medicId is required");
      }

      return appointmentRepository.getAppointmentsByMedic(medicId,signal);
    },
  });
}