import apiClient from './api';
import { LoginRequest, LoginResponse, User, UserRegistration } from '@/types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('login_at', new Date().toISOString());
    }
    return response.data;
  },

  register: async (userData: UserRegistration): Promise<User> => {
    const response = await apiClient.post<User>('/users/', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('login_at');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>('/users/update_profile/', userData);
    return response.data;
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  },

  getLoginAt: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('login_at');
    }
    return null;
  },
};
