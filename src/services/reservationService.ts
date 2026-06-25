import { apiClient } from '../core/network/apiClient';
import { Reservation, CreateReservationPayload } from '../types/reservation';

export const createReservation = async (
  payload: CreateReservationPayload
): Promise<{ success: boolean; data?: Reservation }> => {
  const response = await apiClient.post('/reservas', payload);
  return {
    success: true,
    data: response.data?.data || response.data,
  };
};

export const getReservationsByCliente = async (
  clienteId: number
): Promise<Reservation[]> => {
  const response = await apiClient.get(`/reservas/cliente/${clienteId}`);
  return response.data || [];
};

export const getReservationsByLugar = async (
  lugarId: number
): Promise<Reservation[]> => {
  const response = await apiClient.get(`/reservas/lugar/${lugarId}`);
  const lugarData = response.data;
  if (lugarData && Array.isArray(lugarData.reservas)) {
    return lugarData.reservas;
  }
  return [];
};
