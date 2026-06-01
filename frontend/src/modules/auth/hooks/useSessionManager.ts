import { useEffect, useState, useCallback } from "react";

import { useAuthStore } from "../store/authStore";

import {
  getTokenTimeLeftMs,
  isTokenExpired,
} from "@/shared/utils/jwt";

import { UnauthorizedError } from "@/shared/errors/UnauthorizedError";

import { useRefreshAccessToken } from "./useRefreshAccessToken";
import { useLogout } from "./useLogout";

export const useSessionManager = (warnBeforeMs = 60_000) => {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.logout);
  const updateToken = useAuthStore((s) => s.updateToken);

  const hasHydrated = useAuthStore.persist.hasHydrated();

  const { mutateAsync: refreshSession, isPending: refreshing } =
    useRefreshAccessToken();

  const { mutateAsync: logoutSession, isPending: loggingOut } =
    useLogout();

  const [showRenewModal, setShowRenewModal] = useState(false);

  const safeLogout = useCallback(() => {
    setShowRenewModal(false);
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (!hasHydrated) return;

    const accessToken = user?.tokenMetadata?.accessToken;
    if (!accessToken) return;

    const timeLeft = getTokenTimeLeftMs(accessToken);

    // si ya expiró, salir inmediato
    if (timeLeft <= 0 || isTokenExpired(accessToken)) {
      safeLogout();
      return;
    }

    const warningAt = timeLeft - warnBeforeMs;

    let warningTimer: ReturnType<typeof setTimeout> | undefined;
    let expireTimer: ReturnType<typeof setTimeout> | undefined;

    // warning modal
    if (warningAt > 0) {
      warningTimer = setTimeout(() => {
        setShowRenewModal(true);
      }, warningAt);
    } else {
      setShowRenewModal(true);
    }

    // 
    expireTimer = setTimeout(() => {
      setShowRenewModal(false); 
      clearSession(); // logout real
    }, timeLeft);

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (expireTimer) clearTimeout(expireTimer);
    };
  }, [
    hasHydrated,
    user?.tokenMetadata?.accessToken,
    warnBeforeMs,
    clearSession,
    safeLogout,
  ]);

  const renew = async () => {
    try {
      const refreshToken = user?.tokenMetadata?.refreshToken;

      if (!refreshToken) {
        safeLogout();
        return;
      }

      const tokenMetadata = await refreshSession(refreshToken);

      updateToken(tokenMetadata);

      setShowRenewModal(false);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        safeLogout();
        return;
      }

      safeLogout();
    }
  };

  const forceLogout = async () => {
    try {
      await logoutSession();
    } finally {
      safeLogout(); 
    }
  };

  const close = () => setShowRenewModal(false);

  return {
    showRenewModal,
    renew,
    forceLogout,
    close,
    renewing: refreshing || loggingOut,
  };
};