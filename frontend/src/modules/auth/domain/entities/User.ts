import type { KeycloakToken } from "./KeycloakToken";
export type User = {
  id: number;
  username: string;
  roles: string[];
  permissions: string[];
  tokenMetadata: KeycloakToken;
};
