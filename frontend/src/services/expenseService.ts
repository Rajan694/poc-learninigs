import axios from 'axios';
import type { Expense } from '../types';
import { getStoredToken } from './authService';

const EXPENSE_API_URL = import.meta.env.VITE_API_EXPENCE_SERVICE ?? 'http://localhost:3003';

const expenseClient = axios.create({
  baseURL: EXPENSE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

expenseClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await expenseClient.get('/expenses');
    return response.data as Expense[];
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Failed to fetch expenses', { cause: error });
  }
};

export const createExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  try {
    const response = await expenseClient.post('/expenses', expenseData);
    return response.data as Expense;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Failed to create expense', { cause: error });
  }
};

export const updateExpense = async (id: string, updates: Partial<Expense>): Promise<Expense> => {
  try {
    const response = await expenseClient.patch(`/expenses/${id}`, updates);
    return response.data as Expense;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Failed to update expense', { cause: error });
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  try {
    await expenseClient.delete(`/expenses/${id}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Failed to delete expense', { cause: error });
  }
};
