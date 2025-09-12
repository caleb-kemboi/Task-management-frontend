import { useEffect, useState } from "react";
import { fetchUsers } from "../services/tasks";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
  initial?: any;
}

export default function TaskModal({ open, onClose, onSave, initial }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingUsers(true);
    (async () => {
      try {
        const u = await fetchUsers();
        setUsers(u);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setStatus(initial?.status ?? "TODO");
    setAssigneeId(initial?.assigneeId ?? null);
  }, [initial, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          {initial ? "Edit Task" : "Create Task"}
        </h3>

        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          className="w-full mb-3 px-3 py-2 border rounded-lg focus:ring focus:ring-purple-200"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />

        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          className="w-full mb-3 px-3 py-2 border rounded-lg focus:ring focus:ring-purple-200"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task details..."
        />

        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="w-full mb-3 px-3 py-2 border rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <label className="block text-sm font-medium mb-1">Assignee</label>
        <select
          className="w-full mb-4 px-3 py-2 border rounded-lg"
          value={assigneeId ?? ""}
          onChange={(e) => setAssigneeId(e.target.value || null)}
        >
          <option value="">Unassigned</option>
          {loadingUsers ? (
            <option disabled>Loading...</option>
          ) : (
            users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))
          )}
        </select>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
            onClick={async () => {
              if (!title.trim()) return; 
              setSaving(true);
              await onSave({ title, description, status, assigneeId });
              setSaving(false);
              onClose();
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
