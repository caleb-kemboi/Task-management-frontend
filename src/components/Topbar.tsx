import { Bell } from "lucide-react";

const Topbar = () => {
  return (
    <div className="w-full bg-white shadow flex items-center justify-between px-6 py-6">
      
      <div className="text-lg font-semibold text-black">TASKS_MANAGEMENT</div>

      <div className="flex items-center space-x-4">
        <button className="relative text-gray-600 hover:text-purple-700">
          <Bell size={22} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
      </div>
    </div>
  );
};

export default Topbar;
