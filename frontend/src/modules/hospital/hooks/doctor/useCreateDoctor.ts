import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorRepository } from "@/modules/hospital/infrastructure/repositories/DoctorRepositoryImpl";

type CreateDoctorPayload = {
    id?: number;
    name: string;
    lastName: string;
    speciality: string;
    phoneNumber: string;
    email: string;
};

export const useCreateDoctor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (doctor: CreateDoctorPayload) =>
            doctorRepository.createDoctor(
                doctor.name,
                doctor.lastName,
                doctor.speciality,
                doctor.phoneNumber,
                doctor.email
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["doctors"]
            });
        }
    });
};