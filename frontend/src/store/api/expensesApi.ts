import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Expense } from '../../types';
import * as expenseService from '../../services/expenseService';

export const expensesApi = createApi({
  reducerPath: 'expensesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), // We use queryFn, so baseQuery isn't heavily used, but required.
  tagTypes: ['Expense'],
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      queryFn: async () => {
        try {
          const data = await expenseService.getExpenses();
          return { data };
        } catch (error: any) {
          return { error: error.message || 'Failed to fetch expenses' };
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Expense' as const, id })), { type: 'Expense', id: 'LIST' }]
          : [{ type: 'Expense', id: 'LIST' }],
    }),
    createExpense: builder.mutation<Expense, Omit<Expense, 'id' | 'createdAt'>>({
      queryFn: async (expenseData) => {
        try {
          const data = await expenseService.createExpense(expenseData);
          return { data };
        } catch (error: any) {
          return { error: error.message || 'Failed to create expense' };
        }
      },
      invalidatesTags: [{ type: 'Expense', id: 'LIST' }],
    }),
    updateExpense: builder.mutation<Expense, { id: string; updates: Partial<Expense> }>({
      queryFn: async ({ id, updates }) => {
        try {
          const data = await expenseService.updateExpense(id, updates);
          return { data };
        } catch (error: any) {
          return { error: error.message || 'Failed to update expense' };
        }
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Expense', id }],
    }),
    deleteExpense: builder.mutation<string, string>({
      queryFn: async (id) => {
        try {
          await expenseService.deleteExpense(id);
          return { data: id };
        } catch (error: any) {
          return { error: error.message || 'Failed to delete expense' };
        }
      },
      invalidatesTags: (_, __, id) => [{ type: 'Expense', id }],
    }),
  }),
});

export const { useGetExpensesQuery, useCreateExpenseMutation, useUpdateExpenseMutation, useDeleteExpenseMutation } =
  expensesApi;
