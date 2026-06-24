import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task } from '../../types';
import * as taskService from '../../services/taskService';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // We use queryFn, so baseQuery isn't heavily used, but required.
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      queryFn: async () => {
        try {
          const data = await taskService.getTasks();
          return { data };
        } catch (error: any) {
          return { error: error.message || 'Failed to fetch tasks' };
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Task' as const, id })), { type: 'Task', id: 'LIST' }]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    createTask: builder.mutation<Task, Omit<Task, 'id' | 'createdAt'>>({
      queryFn: async (taskData) => {
        try {
          const data = await taskService.createTask(taskData);
          return { data };
        } catch (error: any) {
          return { error: error.message || 'Failed to create task' };
        }
      },
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation<Task, { id: string; updates: Partial<Task> }>({
      queryFn: async ({ id, updates }) => {
        try {
          const data = await taskService.updateTask(id, updates);
          return { data };
        } catch (error: any) {
          return { error: error.message || 'Failed to update task' };
        }
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Task', id }],
    }),
    deleteTask: builder.mutation<string, string>({
      queryFn: async (id) => {
        try {
          await taskService.deleteTask(id);
          return { data: id };
        } catch (error: any) {
          return { error: error.message || 'Failed to delete task' };
        }
      },
      invalidatesTags: (_, __, id) => [{ type: 'Task', id }],
    }),
  }),
});

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;
