import type { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-memory mock user
let currentUser: User | null = null;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockLogin = async (email: string, password: string):Promise<{user: User, token: string}> => {
  await delay(800);
  if (email && password.length >= 6) {
    currentUser = { id: uuidv4(), name: email.split('@')[0], email };
    return { user: currentUser, token: 'mock-jwt-token' };
  }
  throw new Error('Invalid email or password');
};

export const mockSignup = async (name: string, email: string, password: string):Promise<{user: User, token: string}> => {
  await delay(800);
  if (name && email && password.length >= 6) {
    currentUser = { id: uuidv4(), name, email };
    return { user: currentUser, token: 'mock-jwt-token' };
  }
  throw new Error('Validation failed');
};

export const mockLogout = async ():Promise<void> => {
  await delay(500);
  currentUser = null;
};
