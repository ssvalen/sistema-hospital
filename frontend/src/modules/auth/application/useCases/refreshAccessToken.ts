import type { AuthRepository } from "../interfaces/AuthRepository";

export const refreshAccessToken = async (repo: AuthRepository) => {
  const data = await repo.refresh();
  if (!data?.accessToken) throw new Error("Refresh sin accessToken");
  return data.accessToken;
};