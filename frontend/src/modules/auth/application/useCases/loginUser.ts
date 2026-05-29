import type { AuthRepository } from "../interfaces/AuthRepository";
import type { User } from "../../domain/entities/User";

import { PERMISSIONS } from "@/shared/utils/permissions";

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
      permissions: Object.values(PERMISSIONS).flatMap(module =>
        Object.values(module)
      ),
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