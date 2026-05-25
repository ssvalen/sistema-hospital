
import type { User } from "../../domain/entities/User";

export interface AuthRepository {
  login(username: string, password: string): Promise<User>;
}
