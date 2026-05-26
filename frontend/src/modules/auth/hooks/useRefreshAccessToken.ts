import { useMutation } from "@tanstack/react-query";
import { refreshAccessToken } from "../application/useCases/refreshAccessToken";
import { authRepository } from "../infrastructure/repositories/AuthRepositoryImpl";

export const useRefreshAccessToken = () => {
  return useMutation({
    mutationFn: () => refreshAccessToken(authRepository),
  });
};