import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { getTokenTimeLeftMs, isTokenExpired } from "@/shared/utils/jwt";

export const useSessionManager = (warnBeforeMs = 60_000) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hasHydrated = useAuthStore.persist.hasHydrated();

  const [showModal, setShowModal] = useState(false);

  const safeLogout = useCallback(() => {
    setShowModal(false);
    logout();
  }, [logout]);

  useEffect(() => {
    if (!hasHydrated) return;

    const token = user?.tokenMetadata?.accessToken;
    if (!token) return;

    const timeLeft = getTokenTimeLeftMs(token);

    if (timeLeft <= 0 || isTokenExpired(token)) {
      safeLogout();
      return;
    }

    const warningAt = timeLeft - warnBeforeMs;

    const t1 = setTimeout(() => setShowModal(true), Math.max(warningAt, 0));
    const t2 = setTimeout(() => safeLogout(), timeLeft);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [user, hasHydrated, warnBeforeMs, safeLogout]);

  return {
    showModal,
    close: () => setShowModal(false),
    logout: safeLogout,
  };
};