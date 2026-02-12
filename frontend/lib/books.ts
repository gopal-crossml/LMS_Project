import apiClient from './api';
import { Book, BookList, PaginatedResponse, BookStatistics } from '@/types';

export const bookService = {
  getBooks: async (params?: {
    page?: number;
    search?: string;
    category?: number;
    status?: string;
    language?: string;
    author?: string;
  }): Promise<PaginatedResponse<BookList>> => {
    const response = await apiClient.get<PaginatedResponse<BookList>>('/books/', { params });
    return response.data;
  },

  getBook: async (id: number): Promise<Book> => {
    const response = await apiClient.get<Book>(`/books/${id}/`);
    return response.data;
  },

  createBook: async (bookData: Partial<Book>): Promise<Book> => {
    const response = await apiClient.post<Book>('/books/', bookData);
    return response.data;
  },

  updateBook: async (id: number, bookData: Partial<Book>): Promise<Book> => {
    const response = await apiClient.put<Book>(`/books/${id}/`, bookData);
    return response.data;
  },

  deleteBook: async (id: number): Promise<void> => {
    await apiClient.delete(`/books/${id}/`);
  },

  getAvailableBooks: async (): Promise<BookList[]> => {
    const response = await apiClient.get<BookList[]>('/books/available/');
    return response.data;
  },

  getBookStatistics: async (): Promise<BookStatistics> => {
    const response = await apiClient.get<BookStatistics>('/books/statistics/');
    return response.data;
  },

  searchBooks: async (query: string): Promise<BookList[]> => {
    const response = await apiClient.get<PaginatedResponse<BookList>>('/books/', {
      params: { search: query }
    });
    return response.data.results;
  },
};
