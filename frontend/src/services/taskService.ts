import axios from 'axios';
import type { Task } from '../types';
import { getStoredToken } from './authService';

const TODO_API_URL = import.meta.env.VITE_API_TODO_SERVICE ?? 'http://localhost:3002';

const taskClient = axios.create({
  baseURL: TODO_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

taskClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await taskClient.get('/tasks');
    return response.data as Task[];
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Failed to fetch tasks');
  }
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  try {
    const response = await taskClient.post('/tasks', taskData);
    return response.data as Task;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Failed to create task');
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  try {
    const response = await taskClient.patch(`/tasks/${id}`, updates);
    return response.data as Task;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Failed to update task');
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await taskClient.delete(`/tasks/${id}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Failed to delete task');
  }
};
