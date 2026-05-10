import type { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

let tasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Complete Project Presentation',
    description: "Finish the slide deck for tomorrow's meeting.",
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Update React Dependencies',
    description: 'Upgrade React and React Router to latest versions.',
    status: 'completed',
    priority: 'medium',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockGetTasks = async (): Promise<Task[]> => {
  await delay(600);
  return [...tasks];
};

export const mockCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
  await delay(500);
  const newTask: Task = {
    ...taskData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  tasks = [newTask, ...tasks];
  return newTask;
};

export const mockUpdateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  await delay(500);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Task not found');
  tasks[index] = { ...tasks[index], ...updates };
  return tasks[index];
};

export const mockDeleteTask = async (id: string): Promise<void> => {
  await delay(500);
  tasks = tasks.filter((t) => t.id !== id);
};
