
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "../modules/auth/store/authStore";

type Props = {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
