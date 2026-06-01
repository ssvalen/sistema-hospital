import type { Appointment } from "../types/AppointmentTypes";

const KEY = "appointments_store";

export const AppointmentStore = {
  get(): Appointment[] {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  },

  set(data: Appointment[]) {
    localStorage.setItem(KEY, JSON.stringify(data));
  },

  add(item: Appointment) {
    const all = AppointmentStore.get();
    AppointmentStore.set([...all, item]);
  },

  getById(id: string) {
    return AppointmentStore.get().find((a) => a.id === id);
  },
};