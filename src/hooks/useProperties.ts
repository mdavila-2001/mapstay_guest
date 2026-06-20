import { useState, useEffect, useCallback } from 'react';
import { Property, AdvancedSearchPayload } from '../types';
import { searchProperties, advancedSearchProperties } from '../services/propertyService';
import { useNotification } from '../components/NotificationProvider';

interface UsePropertiesResult {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  refetch: (criteria?: string) => Promise<void>;
  fetchAdvanced: (filters: AdvancedSearchPayload) => Promise<void>;
}

export function useProperties(): UsePropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useNotification();

  const fetchProperties = useCallback(async (criteria?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const searchCriteria = criteria ?? '';
      const data = await searchProperties(searchCriteria);
      setProperties(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al cargar los alojamientos.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAdvanced = useCallback(async (filters: AdvancedSearchPayload): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await advancedSearchProperties(filters);
      setProperties(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado en búsqueda avanzada.';
      setError(msg);
      showToast({ message: msg, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProperties('');
  }, [fetchProperties]);

  return {
    properties,
    isLoading,
    error,
    refetch: fetchProperties,
    fetchAdvanced,
  };
}
