export type RefreshRequestDto = {
  grant_type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

export type RefreshResponseDto = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token?: string;
  session_state?: string;
  scope?: string;
};