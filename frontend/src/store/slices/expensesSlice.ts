import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Expense } from '../../types';
import * as expenseService from '../../services/expenseService';

interface ExpensesState {
  items: Expense[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async () => {
  return await expenseService.getExpenses();
});

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    return await expenseService.createExpense(expenseData);
  },
);

export const editExpense = createAsyncThunk(
  'expenses/editExpense',
  async ({ id, updates }: { id: string; updates: Partial<Expense> }) => {
    return await expenseService.updateExpense(id, updates);
  },
);

export const removeExpense = createAsyncThunk('expenses/removeExpense', async (id: string) => {
  await expenseService.deleteExpense(id);
  return id;
});

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;
