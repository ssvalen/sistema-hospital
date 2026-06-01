import type { AuthRepository } from "../../application/interfaces/AuthRepository";
import type { HttpClient } from "@/shared/http/HttpClient";
import { createApiClient } from "@/shared/http/createApiClient";

import type { LoginRequestDto, LoginResponseDto, LogoutRequestDto } from "../../domain/dto/authLogin.dto";
import type { RefreshRequestDto, RefreshResponseDto } from "../../domain/dto/authRefresh.dto";
import { loginDtoToUser, refreshDtoToTokenMetadata } from "../mappers/authMapper";
import { API_ROUTES } from "@/shared/utils/apiRoutes";

export function createAuthRepository(http: HttpClient): AuthRepository {
  return {
    async login(username: string, password: string, signal) {
      const dtoBody: LoginRequestDto = {
        grant_type: "password",
        client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
        username,
        password,
        scope: import.meta.env.VITE_KEYCLOAK_SCOPE,
        client_secret: import.meta.env.VITE_KEYCLOAK_CLIENTE_SECRET
      }
      const body = new URLSearchParams(dtoBody)

      const dto = await http.request<LoginResponseDto>({
        url: API_ROUTES.KEYCLOAK_LOGIN,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        withCredentials: false,
        timeoutMs: 15_000,
        signal
      });

      return loginDtoToUser(dto);
    },

    async refresh(refreshToken: string, signal: AbortSignal) {

      const dtoBody : RefreshRequestDto = {
        grant_type: "refresh_token",
        client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
        client_secret: import.meta.env.VITE_KEYCLOAK_CLIENTE_SECRET,
        refresh_token: refreshToken,
      }

      const body = new URLSearchParams(dtoBody);

      const dto = await http.request<RefreshResponseDto>({
        url: API_ROUTES.KEYCLOAK_REFRESH,
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body,
        withCredentials: false,
        timeoutMs: 15000,
        signal,
      });

      return refreshDtoToTokenMetadata(dto);
    },

    async logout(refreshToken: string, signal: AbortSignal) {

      const dtoBody : LogoutRequestDto = {
        grant_type: "refresh_token",
        client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
        client_secret: import.meta.env.VITE_KEYCLOAK_CLIENTE_SECRET,
        refresh_token: refreshToken,
      }

      const body = new URLSearchParams(dtoBody);

      const dto = await http.request<void>({
        url: API_ROUTES.KEYCLOAK_LOGOUT,
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body,
        withCredentials: false,
        timeoutMs: 15000,
        signal,
      });
    },
  };
}


const httpClient = createApiClient(import.meta.env.VITE_KEYCLOAK_URL ?? "");
export const authRepository: AuthRepository = createAuthRepository(httpClient);