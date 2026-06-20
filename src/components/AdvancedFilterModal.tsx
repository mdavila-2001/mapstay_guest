import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  Switch,
  ScrollView,
  PanResponder,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';
import { Input } from './Input';
import { AdvancedSearchPayload } from '../types';
import { COLORS, SPACING, RADIUS } from '../core/theme/theme';

export interface AdvancedFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedSearchPayload) => void;
  currentCiudad: string;
}

const colors = COLORS.dark;

const MIN_PRICE = 0;
const MAX_PRICE = 500;

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentCiudad,
}) => {
  const insets = useSafeAreaInsets();

  const [precioNoche, setPrecioNoche] = useState<number>(0);
  const [cantCamas, setCantCamas] = useState<number>(0);
  const [cantBanios, setCantBanios] = useState<number>(0);
  const [cantHabitaciones, setCantHabitaciones] = useState<number>(0);
  const [tieneWifi, setTieneWifi] = useState<boolean>(false);
  const [tieneParqueo, setTieneParqueo] = useState<boolean>(false);
  const [cantVehiculos, setCantVehiculos] = useState<number>(1);
  const [ciudad, setCiudad] = useState<string>('');
  const [cantPersonas, setCantPersonas] = useState<string>('');

  const [sliderWidth, setSliderWidth] = useState<number>(200);
  const startSliderValue = useRef<number>(0);

  useEffect(() => {
    if (visible) {
      setCiudad(currentCiudad);
      setPrecioNoche(0);
      setCantCamas(0);
      setCantBanios(0);
      setCantHabitaciones(0);
      setTieneWifi(false);
      setTieneParqueo(false);
      setCantVehiculos(1);
      setCantPersonas('');
    }
  }, [visible, currentCiudad]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startSliderValue.current = precioNoche;
      },
      onPanResponderMove: (_, gestureState) => {
        const deltaPct = gestureState.dx / sliderWidth;
        const deltaVal = deltaPct * (MAX_PRICE - MIN_PRICE);
        const newVal = startSliderValue.current + deltaVal;
        const clampedVal = Math.max(MIN_PRICE, Math.min(MAX_PRICE, newVal));
        setPrecioNoche(Math.round(clampedVal));
      },
    })
  ).current;

  const pricePct = ((precioNoche - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  const handleApply = () => {
    const trimmedCiudad = ciudad.trim();
    if (!trimmedCiudad) {
      return;
    }

    const payload: AdvancedSearchPayload = {
      ciudad: trimmedCiudad,
    };

    if (tieneWifi) {
      payload.tieneWifi = 1;
    }

    const personasVal = cantPersonas.trim();
    if (personasVal) {
      payload.cantPersonas = personasVal;
    }

    if (cantCamas > 0) {
      payload.cantCamas = cantCamas;
    }

    if (cantBanios > 0) {
      payload.cantBanios = cantBanios;
    }

    if (cantHabitaciones > 0) {
      payload.cantHabitaciones = cantHabitaciones;
    }

    if (tieneParqueo) {
      payload.cantVehiculosParqueo = cantVehiculos;
    }

    if (precioNoche > 0) {
      payload.precioNoche = Number(precioNoche.toFixed(1));
    }

    onApply(payload);
    onClose();
  };

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

        <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>

          <View style={styles.dragIndicator} />

          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Filtros Avanzados</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>

            <View style={styles.filterSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Precio máximo por noche</Text>
                <Text style={styles.priceValueText}>
                  {precioNoche > 0 ? `$${precioNoche}` : 'Cualquier precio'}
                </Text>
              </View>

              <View
                style={styles.sliderTrackContainer}
                onLayout={(e) => {
                  const w = e.nativeEvent.layout.width;
                  if (w > 0) setSliderWidth(w);
                }}
              >
                <View style={styles.sliderTrack} />
                <View style={[styles.sliderTrackActive, { width: `${pricePct}%` }]} />
                <View
                  style={[styles.sliderThumb, { left: `${pricePct}%` }]}
                  {...panResponder.panHandlers}
                />
              </View>
              <View style={styles.sliderLabelsRow}>
                <Text style={styles.sliderLabel}>${MIN_PRICE}</Text>
                <Text style={styles.sliderLabel}>${MAX_PRICE}+</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Distribución física</Text>

              <View style={styles.counterRow}>
                <Text style={styles.counterLabel}>Camas</Text>
                <View style={styles.counterControls}>
                  <Pressable
                    disabled={cantCamas === 0}
                    onPress={() => setCantCamas((c) => Math.max(0, c - 1))}
                    style={[styles.counterBtn, cantCamas === 0 && styles.counterBtnDisabled]}
                  >
                    <Ionicons name="remove" size={16} color={cantCamas === 0 ? colors.border : colors.textPrimary} />
                  </Pressable>
                  <Text style={styles.counterValue}>{cantCamas}</Text>
                  <Pressable
                    onPress={() => setCantCamas((c) => c + 1)}
                    style={styles.counterBtn}
                  >
                    <Ionicons name="add" size={16} color={colors.textPrimary} />
                  </Pressable>
                </View>
              </View>

              <View style={styles.counterRow}>
                <Text style={styles.counterLabel}>Baños</Text>
                <View style={styles.counterControls}>
                  <Pressable
                    disabled={cantBanios === 0}
                    onPress={() => setCantBanios((b) => Math.max(0, b - 1))}
                    style={[styles.counterBtn, cantBanios === 0 && styles.counterBtnDisabled]}
                  >
                    <Ionicons name="remove" size={16} color={cantBanios === 0 ? colors.border : colors.textPrimary} />
                  </Pressable>
                  <Text style={styles.counterValue}>{cantBanios}</Text>
                  <Pressable
                    onPress={() => setCantBanios((b) => b + 1)}
                    style={styles.counterBtn}
                  >
                    <Ionicons name="add" size={16} color={colors.textPrimary} />
                  </Pressable>
                </View>
              </View>

              <View style={styles.counterRow}>
                <Text style={styles.counterLabel}>Habitaciones</Text>
                <View style={styles.counterControls}>
                  <Pressable
                    disabled={cantHabitaciones === 0}
                    onPress={() => setCantHabitaciones((r) => Math.max(0, r - 1))}
                    style={[styles.counterBtn, cantHabitaciones === 0 && styles.counterBtnDisabled]}
                  >
                    <Ionicons name="remove" size={16} color={cantHabitaciones === 0 ? colors.border : colors.textPrimary} />
                  </Pressable>
                  <Text style={styles.counterValue}>{cantHabitaciones}</Text>
                  <Pressable
                    onPress={() => setCantHabitaciones((r) => r + 1)}
                    style={styles.counterBtn}
                  >
                    <Ionicons name="add" size={16} color={colors.textPrimary} />
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Servicios incluidos</Text>

              <View style={styles.switchRow}>
                <View style={styles.switchLabelContainer}>
                  <Ionicons name="wifi" size={20} color={colors.textPrimary} style={styles.switchIcon} />
                  <Text style={styles.switchLabel}>Tiene Wi-Fi</Text>
                </View>
                <Switch
                  value={tieneWifi}
                  onValueChange={setTieneWifi}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={tieneWifi ? colors.textPrimary : colors.textSecondary}
                  ios_backgroundColor={colors.border}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchLabelContainer}>
                  <Ionicons name="car" size={20} color={colors.textPrimary} style={styles.switchIcon} />
                  <Text style={styles.switchLabel}>Parqueo de vehículos</Text>
                </View>
                <Switch
                  value={tieneParqueo}
                  onValueChange={setTieneParqueo}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={tieneParqueo ? colors.textPrimary : colors.textSecondary}
                  ios_backgroundColor={colors.border}
                />
              </View>

              {/* Contador de Vehículos Condicional */}
              {tieneParqueo && (
                <View style={styles.counterRow}>
                  <Text style={[styles.counterLabel, { paddingLeft: 28 }]}>Cantidad de vehículos</Text>
                  <View style={styles.counterControls}>
                    <Pressable
                      disabled={cantVehiculos <= 1}
                      onPress={() => setCantVehiculos((v) => Math.max(1, v - 1))}
                      style={[styles.counterBtn, cantVehiculos <= 1 && styles.counterBtnDisabled]}
                    >
                      <Ionicons name="remove" size={16} color={cantVehiculos <= 1 ? colors.border : colors.textPrimary} />
                    </Pressable>
                    <Text style={styles.counterValue}>{cantVehiculos}</Text>
                    <Pressable
                      onPress={() => setCantVehiculos((v) => v + 1)}
                      style={styles.counterBtn}
                    >
                      <Ionicons name="add" size={16} color={colors.textPrimary} />
                    </Pressable>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Ubicación</Text>

              <Input
                variant="text"
                label="Ciudad (Obligatorio)"
                placeholder="Ej. Santa Cruz, La Paz, etc."
                value={ciudad}
                onValueChange={(val) => setCiudad(val as string)}
                iconName="location-outline"
                inputContainerStyle={styles.textInputOverride}
              />

              <Input
                variant="number"
                label="Cantidad de huéspedes (Opcional)"
                placeholder="Ej. 2"
                value={cantPersonas}
                onValueChange={(val) => setCantPersonas(val as string)}
                iconName="people-outline"
                keyboardType="numeric"
                inputContainerStyle={styles.textInputOverride}
              />
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>

          <View style={styles.footerButtonContainer}>
            <Button
              text="Aplicar Filtros en Mapa"
              variant="primary"
              onPress={handleApply}
              style={styles.applyBtn}
              disabled={!ciudad.trim()}
            />
          </View>

        </View>
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
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    maxHeight: '90%',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475569',
    alignSelf: 'center',
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  scrollViewContent: {
    paddingHorizontal: SPACING.md,
  },
  filterSection: {
    marginVertical: SPACING.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  priceValueText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  sliderTrackContainer: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: SPACING.xs,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    width: '100%',
  },
  sliderTrackActive: {
    height: 4,
    backgroundColor: colors.accent,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textPrimary,
    borderWidth: 2,
    borderColor: colors.accent,
    position: 'absolute',
    marginLeft: -10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sliderLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: SPACING.sm,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  counterLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  counterBtnDisabled: {
    opacity: 0.4,
  },
  counterValue: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 32,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchIcon: {
    marginRight: 8,
  },
  switchLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  textInputOverride: {
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.md,
    marginTop: SPACING.xs,
  },
  footerButtonContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  applyBtn: {
    width: '100%',
  },
});
