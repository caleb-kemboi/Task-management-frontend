import { useEffect, useState } from "react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";


function AppWithEvents() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      localStorage.getItem("token");
    } catch (err) {
      console.warn("Could not access localStorage during init:", err);
    } finally {
      setReady(true);
    }

    const handleUnauthorized = () => {
      try {
        localStorage.removeItem("token");
      } catch (err) {
      }
      navigate("/login", { replace: true });
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [navigate]);

  if (!ready) {
    return null;
  }

  return <AppRoutes />;
}

export default function App() {
  const basename = (import.meta as any).env?.BASE_URL || "/";

  return (
    <BrowserRouter basename={basename}>
      <AppWithEvents />
    </BrowserRouter>
  );
}
