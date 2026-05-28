import { Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "@/routes/ProtectedRoutes";
import { PublicRoute } from "@/routes/PublicRoute";

import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import UserLayout from "@/layouts/UserLayout";

import LoginPage from "@/modules/auth/ui/pages/LoginPage";
import NotFound from "@/shared/pages/NotFound";

import { adminRoutes } from "@/routes/adminRoutes";

const renderAdminRoutes = (routes: any[]) => {
  return routes.flatMap((r) => {
    // rutas con children
    if (r.children) {
      return r.children.map((c: any) => {
        const Child = c.element;

        return (
          <Route
            key={c.path}
            path={c.path}
            element={<Child />}
          />
        );
      });
    }

    // ruta normal
    if (!r.path) return null;

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