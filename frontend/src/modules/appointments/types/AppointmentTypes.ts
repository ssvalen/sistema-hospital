export type CreateTreatmentParams = {
    appointmentId: number;
    description: string;
    from: string;
    to: string;
    endDate: string;
    patientId: number;
    appointmentStatus: string;
    medicId: number;
    medications: {
        medicationId: number;
        dosage: string;
        quantity: number;
    }[];

};