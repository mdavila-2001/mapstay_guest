import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, TYPOGRAPHY } from '../core/theme/theme';
import { createReservation, getReservationsByLugar } from '../services/reservationService';
import { Property } from '../types/property';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from './NotificationProvider';
import { Button } from './Button';
import { Input } from './Input';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  property: Property;
}

interface DateRange {
  start: Date;
  end: Date;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseISODateLocal(iso: string): Date | null {
  const parts = iso?.split('-');
  if (!parts || parts.length < 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return null;
  return new Date(year, month, day, 0, 0, 0, 0);
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  onClose,
  property,
}) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookedRanges, setBookedRanges] = useState<DateRange[]>([]);

  useEffect(() => {
    if (visible) {
      setCheckIn(null);
      setCheckOut(null);
      setIsSubmitting(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible || !property?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const reservas = await getReservationsByLugar(property.id);
        if (cancelled) return;
        const ranges = reservas
          .map((r) => {
            const start = parseISODateLocal(r.fechaInicio);
            const end = parseISODateLocal(r.fechaFin);
            return start && end ? { start, end } : null;
          })
          .filter((r): r is DateRange => r !== null);
        setBookedRanges(ranges);
      } catch {
        if (!cancelled) setBookedRanges([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, property?.id]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minCheckOutDate = new Date(checkIn ? checkIn.getTime() : today.getTime());
  minCheckOutDate.setDate(minCheckOutDate.getDate() + 1);

  useEffect(() => {
    if (checkIn && checkOut && checkOut <= checkIn) {
      setCheckOut(null);
    }
  }, [checkIn]);

  let cantNoches = 0;
  let precioNoches = 0;
  let precioLimpieza = parseFloat(property.costoLimpieza || '0');
  const precioServicioVal = 3.00;
  let precioTotal = 0;

  if (checkIn && checkOut && checkOut > checkIn) {
    const diffTime = checkOut.getTime() - checkIn.getTime();
    cantNoches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const basePrice = parseFloat(property.precioNoche || '0');
    precioNoches = basePrice * cantNoches;
    precioTotal = precioNoches + precioLimpieza + precioServicioVal;
  }

  const checkInDay = checkIn ? startOfDay(checkIn) : null;
  const checkOutDay = checkOut ? startOfDay(checkOut) : null;

  // El check-out no puede pasar del inicio de la próxima reserva ocupada.
  let maxCheckOutDate: Date | undefined;
  if (checkInDay) {
    for (const range of bookedRanges) {
      if (
        range.start.getTime() > checkInDay.getTime() &&
        (!maxCheckOutDate || range.start.getTime() < maxCheckOutDate.getTime())
      ) {
        maxCheckOutDate = range.start;
      }
    }
  }

  // Una reserva ocupa [inicio, fin); el día de salida queda libre para una nueva entrada.
  let availabilityError: string | null = null;
  if (checkInDay) {
    const checkInBooked = bookedRanges.some(
      (r) => checkInDay.getTime() >= r.start.getTime() && checkInDay.getTime() < r.end.getTime()
    );
    if (checkInBooked) {
      availabilityError = 'La fecha de llegada ya está reservada. Elige otra.';
    } else if (checkOutDay) {
      const overlaps = bookedRanges.some(
        (r) => checkInDay.getTime() < r.end.getTime() && checkOutDay.getTime() > r.start.getTime()
      );
      if (overlaps) {
        availabilityError = 'Esas fechas se cruzan con una reserva existente. Elige otro rango.';
      }
    }
  }

  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleConfirmAndPay = async () => {
    if (!checkIn || !checkOut || cantNoches <= 0) {
      showToast({ message: 'Por favor, selecciona fechas válidas.', type: 'error' });
      return;
    }

    if (availabilityError) {
      showToast({ message: availabilityError, type: 'error' });
      return;
    }

    if (!user || !user.id) {
      showToast({ message: 'Error de autenticación. Inicie sesión nuevamente.', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        lugar_id: property.id,
        cliente_id: user.id,
        fechaInicio: formatDateToISO(checkIn),
        fechaFin: formatDateToISO(checkOut),
        precioTotal: precioTotal.toFixed(2),
        precioLimpieza: precioLimpieza.toFixed(2),
        precioNoches: precioNoches.toFixed(2),
        precioServicio: precioServicioVal.toFixed(2),
      };

      const result = await createReservation(payload);

      if (result.success) {
        showToast({
          message: '¡Reserva confirmada correctamente!',
          type: 'success',
        });
        onClose();
      } else {
        showToast({
          message: 'No se pudo confirmar la reserva. Intente de nuevo.',
          type: 'error',
        });
      }
    } catch (err: any) {
      console.error('Error in createReservation:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error al procesar la reserva.';
      showToast({
        message: `Error: ${errorMsg}`,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidRange = checkIn !== null && checkOut !== null && cantNoches > 0;
  const isFormValid = hasValidRange && !availabilityError;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Pressable
          style={[
            styles.bottomSheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 16 },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Confirmar Reserva</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Cerrar modal"
            >
              <Ionicons name="close" size={24} color="#94a3b8" />
            </Pressable>
          </View>

          <View style={styles.divider} />

          <View style={styles.formContainer}>
            <View style={styles.datePickerRow}>
              <View style={styles.dateInputWrapper}>
                <Input
                  variant="date"
                  label="Llegada"
                  value={checkIn}
                  onValueChange={setCheckIn}
                  minimumDate={today}
                  placeholder="Check-in"
                />
              </View>
              <View style={styles.dateInputWrapper}>
                <Input
                  variant="date"
                  label="Salida"
                  value={checkOut}
                  onValueChange={setCheckOut}
                  minimumDate={minCheckOutDate}
                  maximumDate={maxCheckOutDate}
                  placeholder="Check-out"
                />
              </View>
            </View>

            {availabilityError && (
              <View style={styles.availabilityBanner}>
                <Ionicons name="alert-circle-outline" size={16} color="#F87171" />
                <Text style={styles.availabilityText}>{availabilityError}</Text>
              </View>
            )}

            <View style={styles.breakdownCard}>
              {hasValidRange ? (
                <View style={styles.breakdownContainer}>
                  <Text style={styles.breakdownTitle}>Detalle de Precios</Text>
                  
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>
                      ${parseFloat(property.precioNoche).toFixed(2)} x {cantNoches} {cantNoches === 1 ? 'noche' : 'noches'}
                    </Text>
                    <Text style={styles.breakdownValue}>
                      ${precioNoches.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Gastos de Limpieza</Text>
                    <Text style={styles.breakdownValue}>
                      ${precioLimpieza.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Tarifa de Servicio</Text>
                    <Text style={styles.breakdownValue}>
                      ${precioServicioVal.toFixed(2)}
                    </Text>
                  </View>

                  <View style={[styles.divider, { marginVertical: 12 }]} />

                  <View style={styles.breakdownRow}>
                    <Text style={styles.totalLabel}>Total Consolidado</Text>
                    <Text style={styles.totalValue}>
                      ${precioTotal.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="calendar-outline" size={32} color="#475569" />
                  <Text style={styles.placeholderText}>
                    Selecciona fechas de llegada y salida para calcular el costo total de la reserva.
                  </Text>
                </View>
              )}
            </View>

            <Button
              text={isSubmitting ? '' : 'Confirmar y Pagar'}
              variant="primary"
              disabled={isSubmitting || !isFormValid}
              onPress={handleConfirmAndPay}
              style={styles.payButton}
            >
              {isSubmitting && <ActivityIndicator size="small" color="#ffffff" />}
            </Button>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 14, 32, 0.75)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingHorizontal: 16,
    paddingTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 24,
      },
      web: {
        boxShadow: '0px -4px 12px rgba(0,0,0,0.3)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: '#F1F5F9',
  },
  closeButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    width: '100%',
  },
  formContainer: {
    marginTop: 20,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  dateInputWrapper: {
    flex: 1,
  },
  availabilityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.35)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  availabilityText: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#FCA5A5',
  },
  breakdownCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
    minHeight: 140,
    justifyContent: 'center',
  },
  breakdownContainer: {
    width: '100%',
  },
  breakdownTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#94A3B8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#94A3B8',
  },
  breakdownValue: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#F1F5F9',
  },
  totalLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: TYPOGRAPHY.sizes.md,
    color: '#F1F5F9',
  },
  totalValue: {
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: TYPOGRAPHY.sizes.xl,
    color: colors.teal400,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  payButton: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
