import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentRepository } from "../../infrastructure/repositories/AppointmentRepositoryImpl";



export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: number) =>
      appointmentRepository.cancelAppointment(appointmentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", "appointment"],
      });
    },
  });
};