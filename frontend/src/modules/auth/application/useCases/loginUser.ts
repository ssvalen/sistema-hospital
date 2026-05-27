import type { AuthRepository } from "../interfaces/AuthRepository";
import type { User } from "../../domain/entities/User";

export const loginUser = async (
  repo: AuthRepository,
  username: string,
  password: string,
  signal?: AbortSignal
) => {
  if (!username || !password) {
    throw new Error("Credenciales requeridas");
  }

  let user: User | null = null;

  // ADMIN
  if (username === "admin" && password === "admin") {
    user = {
      id: 1,
      username: "admin",
      roles: ["admin"],
      permissions: [
        "admin.manager",
        "admin.manager.roles",
        "users.view",
        "users.create",
        "users.edit",
        "reports.view",
        "appointments.view"
      ],
      token: "fake-admin-token",
    };

  }

  // USER
  if (username === "user" && password === "user") {
    user = {
      id: 2,
      username: "user",
      roles: ["user"],
      permissions: ["profile.view"],
      token: "fake-user-token",
    };
  }

  // Backend real
  // else {
  //   user = await repo.login(username, password, signal);
  // }

  if (!user?.token) {
    throw new Error("Autenticación fallida");
  }

  return user;
};