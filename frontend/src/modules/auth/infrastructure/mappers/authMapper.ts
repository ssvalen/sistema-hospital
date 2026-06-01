import type { User } from "../../domain/entities/User";
import type { KeycloakToken } from "../../domain/entities/KeycloakToken";

import type { LoginResponseDto } from "../../domain/dto/authLogin.dto";
import type { RefreshResponseDto } from "../../domain/dto/authRefresh.dto";

import { parseJwtPayload } from "@/shared/utils/jwt";
import { PERMISSIONS } from "@/shared/utils/permissions";
export function loginDtoToUser(
  dto: LoginResponseDto
): User {

  const payload =
    parseJwtPayload(dto.access_token);

  return {
    id: 0,
    username: payload?.preferred_username ?? "",
    // roles: payload?.realm_access?.roles ?? [],
    roles: ["admin"],
    // permissions: [],
    //permisos temporales
    permissions: Object.values(PERMISSIONS).flatMap(modulePermissions =>
      Object.values(modulePermissions)
    ),
    tokenMetadata: {
      accessToken: dto.access_token,
      accessTokenExpiresIn: dto.expires_in,
      refreshToken: dto.refresh_token,
      refreshExpiresIn: dto.refresh_expires_in,
      tokenType: dto.token_type,
      idToken: dto.id_token,
      sessionState: dto.session_state,
      scope: dto.scope,
    }
  };
}

export function refreshDtoToTokenMetadata(
  dto: RefreshResponseDto
): KeycloakToken {

  return {
    accessToken: dto.access_token,
    accessTokenExpiresIn: dto.expires_in,
    refreshToken: dto.refresh_token,
    refreshExpiresIn: dto.refresh_expires_in,
    tokenType: dto.token_type,
    idToken: dto.id_token ?? "",
    sessionState: dto.session_state ?? "",
    scope: dto.scope ?? "",
  }
}