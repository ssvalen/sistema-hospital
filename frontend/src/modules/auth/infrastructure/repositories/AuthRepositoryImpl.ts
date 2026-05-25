
import type { AuthRepository } from "../../application/interfaces/AuthRepository";
import { authApi } from "../api/authApi";

export const authRepository: AuthRepository = {
  login(username, password) {
    return authApi.login(username, password);
  },
};
