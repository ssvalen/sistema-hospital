
import { create } from "zustand";
import type { User } from "../domain/entities/User";

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => {
    localStorage.setItem("token", user.token);
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
