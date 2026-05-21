import axios from 'axios';
import type { User } from '../types';

const AUTH_API_URL = import.meta.env.VITE_API_USER_SERVICE ?? 'http://localhost:3001';
const AUTH_TOKEN_KEY = 'fintask_auth_token';
const AUTH_USER_KEY = 'fintask_auth_user';

const authClient = axios.create({
  baseURL: AUTH_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStoredToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getStoredUser = (): User | null => {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

const storeAuth = (user: User, token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

const clearAuth = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await authClient.post('/auth/login', { email, password });
    const payload = response.data as { user: User; token: string };
    storeAuth(payload.user, payload.token);
    return payload;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Login failed', { cause: error });
  }
};

export const signup = async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await authClient.post('/auth/signup', { name, email, password });
    const payload = response.data as { user: User; token: string };
    storeAuth(payload.user, payload.token);
    return payload;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message ?? 'Signup failed', { cause: error });
  }
};

export const logout = async (): Promise<void> => {
  try {
    await authClient.post('/auth/logout');
  } finally {
    clearAuth();
  }
};
