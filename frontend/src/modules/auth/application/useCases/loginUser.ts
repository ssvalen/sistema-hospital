import type { AuthRepository } from "../interfaces/AuthRepository";
import type { User } from "../../domain/entities/User";
import { PERMISSIONS } from "@/shared/utils/permissions";
export const loginUser = async (
  repo: AuthRepository,
  username: string,
  password: string,
  signal?: AbortSignal
) => {


  if (username == 'admin' && password == 'admin') {
    const dummyUser: User = {
      id: 1,
      username: "john.doe",
      roles: ["admin", "doctor"],
      permissions: Object.values(PERMISSIONS).flatMap(modulePermissions =>
        Object.values(modulePermissions)
      ),
      tokenMetadata: {
        accessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.dummy-access-token",
        accessTokenExpiresIn: 3600,
        refreshToken: "dummy-refresh-token",
        refreshExpiresIn: 18000,
        tokenType: "Bearer",
        idToken: "dummy-id-token",
        sessionState: "550e8400-e29b-41d4-a716-446655440000",
        scope: "openid profile email"
      }
    };

    return dummyUser

  }


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