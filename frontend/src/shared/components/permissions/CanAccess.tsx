import { useAuthStore } from "@/modules/auth/store/authStore";

type CanProps = {
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export default function CanAccess({
  permission,
  role,
  fallback = null,
  children,
}: CanProps) {
  const hasRole = useAuthStore((s) => s.hasRole);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const allowed =
    (permission ? hasPermission(permission) : true) &&
    (role ? hasRole(role) : true);

  return allowed ? <>{children}</> : <>{fallback}</>;
}