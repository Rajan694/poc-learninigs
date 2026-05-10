import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Task } from '../../types';
import * as taskService from '../../services/taskService';

interface TasksState {
  items: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  return await taskService.getTasks();
});

export const addTask = createAsyncThunk('tasks/addTask', async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
  return await taskService.createTask(taskData);
});

export const editTask = createAsyncThunk(
  'tasks/editTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    return await taskService.updateTask(id, updates);
  },
);

export const removeTask = createAsyncThunk('tasks/removeTask', async (id: string) => {
  await taskService.deleteTask(id);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
