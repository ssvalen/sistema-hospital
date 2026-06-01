import type { AuthRepository } from "../../application/interfaces/AuthRepository";
import type { HttpClient } from "@/shared/http/HttpClient";
import { createApiClient } from "@/shared/http/createApiClient";

import type { LoginRequestDto, LoginResponseDto } from "../../domain/dto/authLogin.dto";
import type { RefreshResponseDto } from "../../domain/dto/authRefresh.dto";
import { loginDtoToUser, refreshDtoToAccessToken } from "../mappers/authMapper";

export function createAuthRepository(http: HttpClient): AuthRepository {
  return {
    async login(username: string, password: string, signal) {
      const body: LoginRequestDto = { username, password };

      const dto = await http.request<LoginResponseDto>({
        url: "/api/login",
        method: "POST",
        body,
        withCredentials: true, 
        timeoutMs: 15_000,    
        signal
      });

      return loginDtoToUser(dto);
    },

    async refresh(signal) {
      const dto = await http.request<RefreshResponseDto>({
        url: "/api/refresh",
        method: "POST",
        withCredentials: true, 
        timeoutMs: 15_000,
        signal
      });

      return { accessToken: refreshDtoToAccessToken(dto) };
    },
  };
}


const httpClient = createApiClient(import.meta.env.VITE_API_URL ?? "");
export const authRepository: AuthRepository = createAuthRepository(httpClient);