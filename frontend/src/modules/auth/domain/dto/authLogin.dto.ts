export type LoginRequestDto = {
  grant_type: string;
  client_id: string;
  username: string;
  password: string;
  scope: string;
  client_secret: string; //esto es mala practica XD
};

export type LoginResponseDto = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  id_token: string;
  session_state: string;
  scope: string;
};

export type LogoutRequestDto = {
  grant_type: string;
  client_id: string;
  client_secret: string;
  refresh_token: string;
};