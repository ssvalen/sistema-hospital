import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../modules/auth/store/authStore";
import { isTokenExpired } from "@/shared/utils/jwt";

type Props = {
  allowedRoles?: string[];
  requiredPermissions?: string[];
};

export const ProtectedRoute = ({
  allowedRoles,
  requiredPermissions,
}: Props) => {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (!hasHydrated) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //activar esto cuando se implemente api
  // if (user.token && isTokenExpired(user.token)) {
  //   const logout = useAuthStore((s) => s.logout);
  //   logout();
  //   return <Navigate to="/login" replace />;
  // }

  // VALIDAR ROLES
  if (allowedRoles?.length) {
    const hasRole = user.roles.some((role) =>
      allowedRoles.includes(role)
    );

    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // VALIDAR PERMISOS
  if (requiredPermissions?.length) {
    const hasPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );

    if (!hasPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};