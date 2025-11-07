import type { ReactNode } from "react"
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem("token");
  console.log("🔐 PrivateRoute token check:", token); // Add this line

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
