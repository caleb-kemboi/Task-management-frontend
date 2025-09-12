import React, { createContext, useContext, useEffect, useState } from "react";
import * as tasksApi from "../services/tasks";
import type { TaskItem } from "../types";

interface TasksState {
  tasks: TaskItem[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  createTask: (payload: any) => Promise<void>;
  updateTask: (id: string, patch: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksState | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await tasksApi.fetchTasks();
      setTasks(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const createTask = async (payload: any) => {
    const temp: TaskItem = {
      id: "tmp-" + Math.random().toString(36).slice(2),
      title: payload.title,
      description: payload.description || "",
      status: payload.status || "TODO",
      priority: payload.priority || "MEDIUM",
      assigneeId: payload.assigneeId,
      creatorId: payload.creatorId || "me",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [temp, ...prev]);
    try {
      const created = await tasksApi.createTask(payload);
      setTasks(prev => prev.map(t => t.id === temp.id ? created : t));
    } catch (err) {
      setTasks(prev => prev.filter(t => t.id !== temp.id));
      throw err;
    }
  };

  const updateTask = async (id: string, patch: any) => {
    const prev = tasks;
    setTasks(prevState => prevState.map(t => t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t));
    try {
      await tasksApi.updateTask(id, patch);
    } catch (err) {
      setTasks(prev);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    const prev = tasks;
    setTasks(prevState => prevState.filter(t => t.id !== id));
    try {
      await tasksApi.deleteTask(id);
    } catch (err) {
      setTasks(prev);
      throw err;
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, loading, fetchAll, createTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
};
