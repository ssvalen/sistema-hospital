import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentRepository } from "../../infrastructure/repositories/AppointmentRepositoryImpl";

type UpdateAppointmentParams = {
  id: number;
  patientId: number;
  medicId: number;
  appointmentDate: string;
  appointmentStatus: string;
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateAppointmentParams) =>
      appointmentRepository.updateAppointment(
        params.id,
        params.patientId,
        params.medicId,
        params.appointmentDate,
        params.appointmentStatus
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment"] });
    },
  });
};