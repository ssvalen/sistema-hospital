import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentRepository } from "../../infrastructure/repositories/AppointmentRepositoryImpl";


type CreateAppointmentParams = {
  patientId: number;
  medicId: number;
  appointmentDate: string;
  appointmentStatus: string;
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateAppointmentParams) =>
      appointmentRepository.createAppointment(
        params.patientId,
        params.medicId,
        params.appointmentDate,
        params.appointmentStatus
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
    },
  });
};