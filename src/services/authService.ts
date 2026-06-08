import { apiClient } from '../core/network/apiClient';
import { LoginCredentials, RegisterPayload, AuthResponse } from '../types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post<AuthResponse>('/users/', credentials);
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    },
    register: async (user: RegisterPayload): Promise<void> => {
        try {
            await apiClient.post('/cliente/registro', user);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
};