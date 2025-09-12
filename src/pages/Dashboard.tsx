import DashboardLayout from "../components/DashboardLayout";
import TaskBoard from "../components/TaskBoard";



export default function Dashboard() {

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-purple-700 mb-6"> Tasks Progress</h1>

      <TaskBoard />

      
    </DashboardLayout>
  );
}
