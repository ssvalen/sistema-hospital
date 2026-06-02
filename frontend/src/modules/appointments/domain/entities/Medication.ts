export type Medication = {
    id: number;
    commercialName: string;
    activeIngredient: string;
    stock?: number;
    medicalUnit: string;
    dosage?: string;
    quantity?: number;
}