import apiClient from './api';
import { Reservation, PaginatedResponse } from '@/types';

export const reservationService = {
  getReservations: async (params?: {
    page?: number;
    status?: string;
  }): Promise<PaginatedResponse<Reservation>> => {
    const response = await apiClient.get<PaginatedResponse<Reservation>>('/reservations/', { params });
    return response.data;
  },

  createReservation: async (data: { book: number; expiry_date?: string; remarks?: string }): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>('/reservations/', data);
    return response.data;
  },

  cancelReservation: async (id: number): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>(`/reservations/${id}/cancel/`);
    return response.data;
  },

  acceptReservation: async (id: number): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>(`/reservations/${id}/accept/`);
    return response.data;
  },

  getActiveReservations: async (): Promise<Reservation[]> => {
    const response = await apiClient.get<PaginatedResponse<Reservation>>('/reservations/active/');
    return response.data.results;
  },
};
