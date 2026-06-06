import { usePaginatedTable } from "@/shared/hooks/usePaginatedTable";
import { userRepository } from "@/modules/admin/infrastructure/repositories/UserRepositoryImpl";
import type { User } from "@/modules/admin/domain/entities/User";


export const usePaginatedUsers = (page: number, size: number) => {
  return usePaginatedTable<User>(
    "usersPaginated",
    page,
    size,
    ({ page, size, signal }) =>
      userRepository.getUsersPaginated(page, size, signal)
  );
};