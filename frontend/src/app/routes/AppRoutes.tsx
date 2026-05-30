import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "@/routes/ProtectedRoutes";
import { PublicRoute } from "@/routes/PublicRoute";
import { useAuthStore } from "@/modules/auth/store/authStore";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import UserLayout from "@/layouts/UserLayout";

import LoginPage from "@/modules/auth/ui/pages/LoginPage";
import NotFound from "@/shared/pages/NotFound";

import { adminRoutes } from "@/routes/adminRoutes";

const renderAdminRoutes = (routes: any[]) => {
  const hasPermission = useAuthStore.getState().hasPermission;

  return routes.map((r) => {
    // Validar permisos del padre
    if (r.permissions?.length) {
      const allowed = r.permissions.some((p: string) =>
        hasPermission(p)
      );

      if (!allowed) return null;
    }

    // Ruta con hijos
    if (r.children) {
      return r.children.map((c: any) => {
        if (c.permissions?.length) {
          const allowed = c.permissions.some((p: string) =>
            hasPermission(p)
          );

          if (!allowed) return null;
        }

        const Component = c.element;

        return (
          <Route
            key={c.path}
            path={c.path}
            element={<Component />}
          />
        );
      });
    }

    const Component = r.element;

    return (
      <Route
        key={r.path}
        path={r.path}
        element={<Component />}
      />
    );
  });
};

export const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= AUTH ================= */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {renderAdminRoutes(adminRoutes)}
      </Route>

      {/* ================= USER ================= */}
      <Route
        path="/app"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      />

      {/* ================= DEFAULT ================= */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};