import apiClient from './api';
import { Transaction, TransactionCreate, TransactionReturn, PaginatedResponse, TransactionStatistics } from '@/types';

export const transactionService = {
  getTransactions: async (params?: {
    page?: number;
    status?: string;
    user?: number;
  }): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions/', { params });
    return response.data;
  },

  getTransaction: async (id: number): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}/`);
    return response.data;
  },

  issueBook: async (data: TransactionCreate): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions/issue_book/', data);
    return response.data;
  },

  returnBook: async (data: TransactionReturn): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions/return_book/', data);
    return response.data;
  },

  getActiveTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions/active/');
    return response.data.results;
  },

  getOverdueTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>('/transactions/overdue/');
    return response.data.results;
  },

  getTransactionStatistics: async (): Promise<TransactionStatistics> => {
    const response = await apiClient.get<TransactionStatistics>('/transactions/statistics/');
    return response.data;
  },
};
