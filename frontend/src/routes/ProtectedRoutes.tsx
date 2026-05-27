import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../modules/auth/store/authStore";

type Props = {
  allowedRoles?: string[];
  requiredPermissions?: string[];
  children?: React.ReactNode;
};

export const ProtectedRoute = ({
  allowedRoles,
  requiredPermissions,
  children,
}: Props) => {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (!hasHydrated) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // activar esto cuando se implemente api
  // if (user.token && isTokenExpired(user.token)) {
  //   const logout = useAuthStore((s) => s.logout);
  //   logout();
  //   return <Navigate to="/login" replace />;
  // }

  const userRoles = Array.isArray(user.roles)
    ? user.roles.map((r: any) => String(r).toLowerCase())
    : [];

  const userPermissions = Array.isArray(user.permissions)
    ? user.permissions
    : [];

  // ROLES
  if (allowedRoles?.length) {
    const hasRole = userRoles.some((role) =>
      allowedRoles.map((r) => r.toLowerCase()).includes(role)
    );

    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // PERMISO S
  if (requiredPermissions?.length) {
    const hasPermissions = requiredPermissions.every((p) =>
      userPermissions.includes(p)
    );

    if (!hasPermissions) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};