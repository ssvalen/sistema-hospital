import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { getTokenTimeLeftMs, isTokenExpired } from "@/shared/utils/jwt";
import { useRefreshAccessToken } from "./useRefreshAccessToken";
import { UnauthorizedError } from "@/shared/errors/UnauthorizedError";

export const useSessionManager = (warnBeforeMs = 60_000) => {

  
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateToken = useAuthStore((s) => s.updateToken);
  const hasHydrated = useAuthStore.persist.hasHydrated();

  const { mutateAsync, isPending } = useRefreshAccessToken();
  const [showRenewModal, setShowRenewModal] = useState(false);

  useEffect(() => {
    
    if (!hasHydrated) return;
    if (!user?.token) return;


    if (isTokenExpired(user.token)) {
      logout();
      return;
    }

    const timeLeft = getTokenTimeLeftMs(user.token);
    const warningAt = timeLeft - warnBeforeMs;

    let warningTimer: ReturnType<typeof setTimeout> | undefined;
    let expireTimer: ReturnType<typeof setTimeout> | undefined;

    if (warningAt > 0) {
      warningTimer = setTimeout(() => setShowRenewModal(true), warningAt);
    } else {
      setShowRenewModal(true);
    }

    expireTimer = setTimeout(() => logout(), timeLeft);

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (expireTimer) clearTimeout(expireTimer);
    };
  }, [hasHydrated, user?.token, warnBeforeMs, logout]);

  const renew = async () => {
    try {
      const newToken = await mutateAsync();
      updateToken(newToken);
      setShowRenewModal(false);
    } catch (e) {
      // refresh cookie vencida o inválida
      if (e instanceof UnauthorizedError) {
        logout();
        return;
      }
      logout();
    }
  };

  const forceLogout = () => {
    setShowRenewModal(false);
    logout();
  };

  const close = () => setShowRenewModal(false);

  return {
    showRenewModal,
    renew,
    forceLogout,
    close,
    renewing: isPending,
  };
};