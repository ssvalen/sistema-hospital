export type Ingreso = {
    patient: {
        id: number;
        name: string;
        lastname: string;
        fullname: string;
        birthdate: string;
        phone: string;
        gender: "M" | "F"
    }
}