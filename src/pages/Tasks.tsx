
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import TaskModal from "../components/TaskModal";
import api from "../services/api";

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [editingTask, setEditingTask] = useState<any | null>(null);

  const fetchTasks = async (status?: string) => {
    try {
      setLoading(true);
      const query = status ? `?status=${status}` : "";
      const res = await api.get(`/tasks${query}`);
      setTasks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(statusFilter);
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks(statusFilter);
  };

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          {["All", "TODO", "IN_PROGRESS", "DONE"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter === "All" ? "" : filter)}
              className={`px-3 py-1 rounded-lg ${
                statusFilter === filter || (filter === "All" && statusFilter === "")
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {filter === "IN_PROGRESS"
                ? "In Progress"
                : filter === "DONE"
                ? "Done"
                : filter === "TODO"
                ? "Todo"
                : "All"}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setEditingTask(null); 
            setIsModalOpen(true);
          }}
          className="py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add Task
        </button>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-400">No tasks found</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-purple-800 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Assignee</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{task.title}</td>
                <td className="p-3">{task.description}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      task.status === "DONE"
                        ? "bg-green-100 text-green-700"
                        : task.status === "IN_PROGRESS"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {task.status === "IN_PROGRESS"
                      ? "In Progress"
                      : task.status === "DONE"
                      ? "Done"
                      : "Todo"}
                  </span>
                </td>
                <td className="p-3">{task.assigneeId ?? "Unassigned"}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <TaskModal
          open={true}
          initial={editingTask ?? undefined}
          onClose={() => setIsModalOpen(false)}
          onSave={async (payload) => {
            if (editingTask) {
              await api.put(`/tasks/${editingTask.id}`, {
                ...editingTask,
                ...payload,
              });
            } else {
              await api.post("/tasks", payload);
            }
            await fetchTasks(statusFilter);
            setIsModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}
