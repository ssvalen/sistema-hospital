// export type AppointmentStatus =
//   | "scheduled"
//   | "cancelled"
//   | "completed";

// export type Appointment = {
//   id: string;
//   patientId: string;
//   patientName: string;
//   doctorId: string;
//   doctorName: string;
//   start: string;
//   end: string;
//   reason: string;
//   status: AppointmentStatus;
// };

export type CreateTreatmentParams = {
    appointmentId: number;
    description: string;
    from: string;
    to: string;

    medications: {
        medicationId: number;
        dosage: string;
        quantity: number;
    }[];
};