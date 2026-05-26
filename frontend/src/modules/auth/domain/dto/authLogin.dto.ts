export type LoginRequestDto = {
  username: string;
  password: string;
};

export type LoginResponseDto = {
  id: number;
  username: string;
  roles: string[];
  permissions: string[];
  token: string;
};