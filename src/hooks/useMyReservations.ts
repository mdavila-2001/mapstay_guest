import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useNotification } from '../components/NotificationProvider';
import { getReservationsByCliente } from '../services/reservationService';
import { Reservation } from '../types/reservation';

interface UseMyReservationsReturn {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMyReservations(): UseMyReservationsReturn {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyReservations = useCallback(async () => {
    if (!user || !user.id) {
      setReservations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getReservationsByCliente(user.id);
      const safeData = Array.isArray(data) ? data : [];
      setReservations(safeData);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar tus reservas.';
      setError(message);
      showToast({ message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  return {
    reservations,
    isLoading,
    error,
    refetch: fetchMyReservations,
  };
}
