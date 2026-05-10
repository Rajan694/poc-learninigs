import type { Expense } from '../types';
import { v4 as uuidv4 } from 'uuid';

let expenses: Expense[] = [
  {
    id: uuidv4(),
    title: 'Office Lunch',
    amount: 25.5,
    category: 'food',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Uber to Airport',
    amount: 45.0,
    category: 'transport',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Cloud Hosting Subscription',
    amount: 120.0,
    category: 'utilities',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockGetExpenses = async (): Promise<Expense[]> => {
  await delay(600);
  return [...expenses];
};

export const mockCreateExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
  await delay(500);
  const newExpense: Expense = {
    ...expenseData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  expenses = [newExpense, ...expenses];
  return newExpense;
};

export const mockUpdateExpense = async (id: string, updates: Partial<Expense>): Promise<Expense> => {
  await delay(500);
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) throw new Error('Expense not found');
  expenses[index] = { ...expenses[index], ...updates };
  return expenses[index];
};

export const mockDeleteExpense = async (id: string): Promise<void> => {
  await delay(500);
  expenses = expenses.filter((e) => e.id !== id);
};
