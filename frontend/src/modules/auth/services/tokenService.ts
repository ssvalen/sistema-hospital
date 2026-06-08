import { useAuthStore } from "../store/authStore";
import { refreshAccessToken } from "../application/useCases/refreshAccessToken";
import { authRepository } from "../infrastructure/repositories/AuthRepositoryImpl";

let isRefreshing = false;
let queue: (() => void)[] = [];

export async function getValidAccessToken() {
  const user = useAuthStore.getState().user;

  const accessToken = user?.tokenMetadata?.accessToken;
  const refreshToken = user?.tokenMetadata?.refreshToken;
  const expiresIn = user?.tokenMetadata?.accessTokenExpiresIn;

  if (!accessToken || !refreshToken) return null;

  // token válido
  if (expiresIn && Date.now() < expiresIn * 1000) {
    return accessToken;
  }

  // si ya está refrescando → esperar cola
  if (isRefreshing) {
    await new Promise<void>((resolve) => queue.push(resolve));
    return useAuthStore.getState().user?.tokenMetadata?.accessToken;
  }

  isRefreshing = true;

  try {
    const newTokens = await refreshAccessToken(authRepository, refreshToken);

    useAuthStore.getState().updateToken(newTokens);

    queue.forEach((r) => r());
    queue = [];

    return newTokens.accessToken;
  } catch (err) {
    useAuthStore.getState().logout();
    return null;
  } finally {
    isRefreshing = false;
  }
}