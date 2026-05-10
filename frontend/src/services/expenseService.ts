import type { Expense } from '../types';
import { mockGetExpenses, mockCreateExpense, mockUpdateExpense, mockDeleteExpense } from '../demo/expenses.demo';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/expenses';

export const getExpenses = async (): Promise<Expense[]> => {
  // const response = await axios.get(API_URL);
  // return response.data;
  return mockGetExpenses();
};

export const createExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  // const response = await axios.post(API_URL, expenseData);
  // return response.data;
  return mockCreateExpense(expenseData);
};

export const updateExpense = async (id: string, updates: Partial<Expense>): Promise<Expense> => {
  // const response = await axios.put(`${API_URL}/${id}`, updates);
  // return response.data;
  return mockUpdateExpense(id, updates);
};

export const deleteExpense = async (id: string): Promise<void> => {
  // await axios.delete(`${API_URL}/${id}`);
  return mockDeleteExpense(id);
};
