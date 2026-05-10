import type { Task } from '../types';
import { mockGetTasks, mockCreateTask, mockUpdateTask, mockDeleteTask } from '../demo/tasks.demo';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/tasks';

export const getTasks = async (): Promise<Task[]> => {
  // const response = await axios.get(API_URL);
  // return response.data;
  return mockGetTasks();
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  // const response = await axios.post(API_URL, taskData);
  // return response.data;
  return mockCreateTask(taskData);
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  // const response = await axios.put(`${API_URL}/${id}`, updates);
  // return response.data;
  return mockUpdateTask(id, updates);
};

export const deleteTask = async (id: string): Promise<void> => {
  // await axios.delete(`${API_URL}/${id}`);
  return mockDeleteTask(id);
};
