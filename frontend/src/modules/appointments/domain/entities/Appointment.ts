export type Appointment = {
  id: number;
  startDate: string;
  startTime: string;
  status: string;

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
};