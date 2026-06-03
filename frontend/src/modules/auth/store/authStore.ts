import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../domain/entities/User";
import type { KeycloakToken } from "../domain/entities/KeycloakToken";

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  updateToken: (tokenMetadata: KeycloakToken) => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => {
        set({ user });
      },
      logout: () => {
        set({ user: null });
      },

      updateToken: (tokenMetadata) =>
        set((state) => ({
          user: state.user
            ? {
              ...state.user,
              tokenMetadata,
            }
            : null,
        })),

      hasRole: (role) => {
        const user = get().user;

        if (!user) return false;

        return user.roles.includes(role);
      },
      hasPermission: (permission) => {
        const user = get().user;

        if (!user) return false;

        return user.permissions.includes(permission);
      },
    }),

    {
      name: "auth-storage",
    }
  )
);