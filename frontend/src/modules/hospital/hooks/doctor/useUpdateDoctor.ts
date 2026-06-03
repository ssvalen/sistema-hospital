import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorRepository } from "@/modules/hospital/infrastructure/repositories/DoctorRepositoryImpl";

type UpdateDoctorPayload = {
    id: number;
    name: string;
    lastName: string;
    speciality: string;
    phoneNumber: string;
    email: string;
};

export const useUpdateDoctor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (doctor: UpdateDoctorPayload) =>
            doctorRepository.updateDoctor(
                doctor.id,
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