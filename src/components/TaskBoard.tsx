
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import api from "../services/api";

const statuses = ["TODO", "IN_PROGRESS", "DONE"];

const TaskBoard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks"); 
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const handleCreate = async (payload: any) => {
    await api.post("/tasks", payload);
    await fetchTasks();
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());

    const matchesAssignee =
      assigneeFilter === "" || t.assigneeId === assigneeFilter;

    return matchesSearch && matchesAssignee;
  });

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      {/* Filters */}
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          + Add Task
        </button>
      </div>

      <div className="flex gap-6">
        {statuses.map((status) => (
          <div
            key={status}
            className="flex-1 bg-gray-200 rounded-lg p-4 min-h-[70vh]"
          >
            <h2 className="text-lg font-semibold mb-4">{status}</h2>
            {filteredTasks
              .filter((task) => task.status === status)
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        ))}
      </div>

   
      {isModalOpen && (
        <TaskModal
          open={true}
          onClose={() => setIsModalOpen(false)}
          onSave={async (payload) => {
            if (!payload.title.trim()) {
              alert("Title is required");
              return;
            }
            await handleCreate(payload);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TaskBoard;
