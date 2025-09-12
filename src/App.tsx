import { BrowserRouter, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

function AppWithEvents() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const path = window.location.pathname;

    if (!token && path !== "/login" && path !== "/register") {
      navigate("/login", { replace: true });
    }

    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [navigate]);

  return <AppRoutes />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWithEvents />
    </BrowserRouter>
  );
}
