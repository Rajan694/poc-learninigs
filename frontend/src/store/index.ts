import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { tasksApi } from './api/tasksApi';
import { expensesApi } from './api/expensesApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [expensesApi.reducerPath]: expensesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tasksApi.middleware, expensesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
