import type { User } from '../types';
import { mockLogin, mockSignup, mockLogout } from '../demo/auth.demo';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Uncomment below for real API
  // const response = await axios.post(`${API_URL}/login`, { email, password });
  // return response.data;

  // Using mock demo
  return mockLogin(email, password);
};

export const signup = async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  // Uncomment below for real API
  // const response = await axios.post(`${API_URL}/signup`, { name, email, password });
  // return response.data;

  // Using mock demo
  return mockSignup(name, email, password);
};

export const logout = async (): Promise<void> => {
  // Uncomment below for real API
  // await axios.post(`${API_URL}/logout`);

  // Using mock demo
  return mockLogout();
};
