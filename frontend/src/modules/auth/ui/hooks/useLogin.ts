
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../application/useCases/loginUser";
import { authRepository } from "../../infrastructure/repositories/AuthRepositoryImpl";
import { useAuthStore } from "../../store/authStore";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginUser(authRepository, username, password),

    onSuccess: (user) => {
      setUser(user);
    },
  });
};
