export type Patient = {
  id: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  telefono: number;
  direccion: string;
  genero: "M" | "F";
};