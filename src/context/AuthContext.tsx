import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { LoginCredentials, RegisterPayload, AuthResponse } from '../types';

export interface AuthContextType {
  readonly user: AuthResponse | null;
  readonly isLoading: boolean;
  readonly authError: string | null;
  readonly login: (credentials: LoginCredentials) => Promise<boolean>;
  readonly register: (payload: RegisterPayload) => Promise<boolean>;
  readonly logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Restaurar sesión persistida en AsyncStorage al iniciar la aplicación
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@mapstay_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error al restaurar sesión de usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Función de inicio de sesión
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response);
      await AsyncStorage.setItem('@mapstay_user', JSON.stringify(response));
      return true;
    } catch (error: any) {
      const message = error.message || 'Ocurrió un error inesperado al iniciar sesión.';
      setAuthError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro de usuario
  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await authService.register(payload);
      return true;
    } catch (error: any) {
      const message = error.message || 'Ocurrió un error inesperado al registrar el usuario.';
      setAuthError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de cierre de sesión
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('@mapstay_user');
      setUser(null);
      setAuthError(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    authError,
    login,
    register,
    logout,
  }), [user, isLoading, authError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
