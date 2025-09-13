import type { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  let token: string | null = null;
  try {
    token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  } catch (err) {
    console.warn("ProtectedRoute: could not read localStorage:", err);
    token = null;
  }

  const isValidToken =
    token !== null &&
    token.trim() !== "" &&
    token !== "null" &&
    token !== "undefined";

  if (!isValidToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
