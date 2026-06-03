import { useMemo } from "react";
import { useAuthStore } from "@/modules/auth/store/authStore";

type UseAccessParams = {
  permissions?: string[];
  roles?: string[];
  requireAll?: boolean;
};

export function useAccess({
  permissions = [],
  roles = [],
  requireAll = true,
}: UseAccessParams = {}) {
  const hasRole = useAuthStore((s) => s.hasRole);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return useMemo(() => {
    const permissionCheck =
      permissions.length === 0
        ? true
        : requireAll
          ? permissions.every(hasPermission)
          : permissions.some(hasPermission);

    const roleCheck =
      roles.length === 0
        ? true
        : requireAll
          ? roles.every(hasRole)
          : roles.some(hasRole);

    return permissionCheck && roleCheck;
  }, [permissions, roles, requireAll, hasRole, hasPermission]);
}