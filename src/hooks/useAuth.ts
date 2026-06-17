import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/AuthContext';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
