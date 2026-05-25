import { Routes, Route } from "react-router-dom";

import LoginPage from "@/modules/auth/ui/pages/LoginPage";
import { ProtectedRoute } from "@/routes/ProtectedRoutes";
import MainLayout from "@/layouts/MainLayout";

const Dashboard = () => <h1 className="p-6">Dashboard</h1>;

export const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<LoginPage />} />

      {/* PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};