import apiClient from './api';
import { Category } from '@/types';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories/');
    return response.data;
  },

  getCategory: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}/`);
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string }): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories/', data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.put<Category>(`/categories/${id}/`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}/`);
  },
};
