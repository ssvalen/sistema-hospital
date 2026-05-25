
import type { AuthRepository } from "../interfaces/AuthRepository";

export const loginUser = async (
  repo: AuthRepository,
  username: string,
  password: string
) => {
  if (!username || !password) {
    throw new Error("Credenciales requeridas");
  }

  const user = await repo.login(username, password);

  if (!user.token) {
    throw new Error("Autenticación fallida");
  }

  return user;
};
