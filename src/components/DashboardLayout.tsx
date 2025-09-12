
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "../components/Footer";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
