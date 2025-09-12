import api from "./api";
import type { TaskItem } from "../types"; 

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: string;
  assigneeId?: string | null;
}

export async function fetchTasks(status?: string, assignee?: string) {
  const q = new URLSearchParams();
  if (status) q.set("status", status);
  if (assignee) q.set("assignee", assignee);
  const res = await api.get<TaskItem[]>(`/tasks?${q.toString()}`);
  return res.data;
}

export async function createTask(payload: CreateTaskDto) {
  const res = await api.post<TaskItem>("/tasks", payload);
  return res.data;
}

export async function updateTask(id: string, payload: Partial<CreateTaskDto & { status?: string }>) {
  const res = await api.put<TaskItem>(`/tasks/${id}`, payload);
  return res.data;
}

export async function deleteTask(id: string) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
}

export async function fetchUsers() {
  const res = await api.get("/users");
  return res.data as { id: string; username: string }[];
}
