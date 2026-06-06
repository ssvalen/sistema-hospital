import { useQuery } from "@tanstack/react-query";
import { appointmentRepository } from "../../infrastructure/repositories/AppointmentRepositoryImpl";

export const useAppointmentById = (id?: number) => {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: () => appointmentRepository.getAppointmentById(id!),
    enabled: !!id,
  });
};