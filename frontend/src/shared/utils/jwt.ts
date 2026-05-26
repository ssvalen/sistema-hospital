type JwtPayload = { exp?: number } & Record<string, unknown>;

export function parseJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
}

export function getTokenTimeLeftMs(token: string): number {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return 0;
  return payload.exp * 1000 - Date.now();
}

export function isTokenExpired(token: string): boolean {
  return getTokenTimeLeftMs(token) <= 0;
}