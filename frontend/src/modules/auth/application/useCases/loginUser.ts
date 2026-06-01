import type { AuthRepository } from "../interfaces/AuthRepository";

export const loginUser = async (
  repo: AuthRepository,
  username: string,
  password: string,
  signal?: AbortSignal
) => {
  if (!username || !password) {
    throw new Error("Credenciales requeridas");
  }

  const user = await repo.login(
    username,
    password,
    signal
  );

  if (!user?.tokenMetadata?.accessToken) {
    throw new Error("Autenticación fallida");
  }

  return user;
};