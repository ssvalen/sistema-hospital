import { Routes, Route, Navigate } from "react-router-dom";

// Rutas
import { ProtectedRoute } from "@/routes/ProtectedRoutes";
import { PublicRoute } from "@/routes/PublicRoute";
// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/modules/auth/ui/pages/LoginPage";
// Admin
import AdminLayout from "@/layouts/AdminLayout";
// User
import UserLayout from "@/layouts/UserLayout";

// Pages generales
import NotFound from "@/shared/pages/NotFound";
import LogoutPage from "@/shared/pages/LogoutPage";

const AdminDashboard = () => <h1>Admin Dashboard</h1>;
const UserDashboard = () => <h1>User Dashboard</h1>;
const UsersPage = () => <h1>Usuarios</h1>;
const UnauthorizedPage = () => <h1>No autorizado</h1>;

export const AppRoutes = () => {
  return (
    <Routes>


      {/* AUTH */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Route>

      {/* LOGOUT */}
      <Route path="/logout" element={<LogoutPage />} />

      {/* ADMIN ROUTES */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          />
        }
      >
        <Route element={<AdminLayout />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            element={
              <ProtectedRoute
                requiredPermissions={["users.view"]}
              />
            }
          >
            <Route
              path="/admin/users"
              element={<UsersPage />}
            />
          </Route>

        </Route>
      </Route>

      {/* USER ROUTES */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={["user"]}
          />
        }
      >
        <Route element={<UserLayout />}>
          <Route
            path="/app"
            element={<UserDashboard />}
          />
        </Route>
      </Route>

      {/* UNAUTHORIZED */}
      <Route
        path="/unauthorized"
        element={<UnauthorizedPage />}
      />

      {/* DEFAULT */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};