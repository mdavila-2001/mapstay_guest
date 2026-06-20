import { apiClient } from '../core/network/apiClient';
import { Property, AdvancedSearchPayload } from '../types/property';

export const searchProperties = async (search: string): Promise<Property[]> => {
  const payload = { search: search || '' };
  const response = await apiClient.post<Property[]>('/lugares/search', payload);
  return response.data;
};

export const advancedSearchProperties = async (filters: AdvancedSearchPayload): Promise<Property[]> => {
  const response = await apiClient.post<Property[]>('/lugares/advancedsearch', filters);
  return response.data;
};

export const getPropertyById = async (id: number): Promise<Property> => {
  const response = await apiClient.get<Property>(`/lugares/${id}`);
  return response.data;
};

