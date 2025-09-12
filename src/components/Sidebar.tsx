import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, Users, ClipboardList, LogOut } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Tasks", path: "/tasks", icon: <ClipboardList size={20} /> },
    { name: "Users", path: "/users", icon: <Users size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", 
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-purple-800 to-black text-white h-screen flex flex-col transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4">
        <span className={`${isOpen ? "block" : "hidden"} font-bold text-xl`}>
          Menu
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white"
        >
          {isOpen ? (
            <i className="fas fa-times text-xl"></i>
          ) : (
            <i className="fas fa-bars text-xl"></i>
          )}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 p-2 rounded-lg ${
              location.pathname === item.path
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:bg-purple-700 hover:text-white"
            }`}
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full text-left text-red-400 hover:text-red-600"
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
