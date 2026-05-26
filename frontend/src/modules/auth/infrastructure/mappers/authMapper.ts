import type { User } from "../../domain/entities/User";
import type { LoginResponseDto } from "../../domain/dto/authLogin.dto";
import type { RefreshResponseDto } from "../../domain/dto/authRefresh.dto";

export function loginDtoToUser(dto: LoginResponseDto): User {
  return {
    id: dto.id,
    username: dto.username,
    roles: dto.roles,
    permissions: dto.permissions,
    token: dto.token,
  };
}

export function refreshDtoToAccessToken(dto: RefreshResponseDto): string {
  return dto.accessToken;
}