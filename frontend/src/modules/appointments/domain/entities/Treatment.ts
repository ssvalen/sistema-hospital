import type { Medication } from "./Medication";

export type Treatment = {
    id: number;
    description: string;
    from: string;
    to: string;

    appointment: {
        id: number;
        date: string;
        status: string;
    };

    patient: {
        id: number;
        firstName: string;
        lastName: string;
        fullName: string;
    };

    doctor: {
        id: number;
        firstName: string;
        lastName: string;
        specialty: string;
        fullName: string;
    };

    medications: Medication[];
};