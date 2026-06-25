import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, TYPOGRAPHY } from '../core/theme/theme';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useMyReservations } from '../hooks/useMyReservations';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/NotificationProvider';
import { Reservation } from '../types/reservation';
import { Property } from '../types/property';
import { RootStackParamList } from '../navigation/types';

type MyReservationsNavProp = NativeStackNavigationProp<RootStackParamList, 'MyReservations'>;

const MESES_ES: readonly string[] = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

function formatDateES(isoDate: string): string {
  if (!isoDate) return '—';
  const parts = isoDate.split('-');
  if (parts.length < 3) return isoDate;
  const day = parseInt(parts[2], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const mes = MESES_ES[monthIdx] ?? '???';
  return `${day} ${mes}`;
}

function calcNights(fechaInicio: string, fechaFin: string): number {
  const start = new Date(fechaInicio);
  const end = new Date(fechaFin);
  const diff = end.getTime() - start.getTime();
  const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

// El estado "en curso" no lo da el backend; se deriva de las horas de check-in/out.
type ReservationStatus = 'upcoming' | 'ongoing' | 'past';

const CHECK_IN_HOUR = 15;
const CHECK_OUT_HOUR = 10;

// Construye la fecha en horario local; new Date("YYYY-MM-DD") la tomaría como UTC.
function parseLocalDate(isoDate: string, hour: number): Date | null {
  if (!isoDate) return null;
  const parts = isoDate.split('-');
  if (parts.length < 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return null;
  }
  return new Date(year, month, day, hour, 0, 0, 0);
}

function getReservationStatus(
  fechaInicio: string,
  fechaFin: string,
  now: Date = new Date()
): ReservationStatus {
  const checkIn = parseLocalDate(fechaInicio, CHECK_IN_HOUR);
  const checkOut = parseLocalDate(fechaFin, CHECK_OUT_HOUR);
  if (!checkIn || !checkOut) return 'upcoming';
  if (now.getTime() < checkIn.getTime()) return 'upcoming';
  if (now.getTime() > checkOut.getTime()) return 'past';
  return 'ongoing';
}

function ensureHttpProtocol(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const clean = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return `http://${clean}`;
}

interface ReservationCardProps {
  item: Reservation;
  onPress: (propertyId: number) => void;
}

const ReservationCard = React.memo(function ReservationCard({ item, onPress }: ReservationCardProps) {
  const property: Property | undefined =
    item.lugar && Array.isArray(item.lugar) && item.lugar.length > 0
      ? item.lugar[0]
      : undefined;

  if (!property) return null;

  const hasPhotos =
    property.fotos && Array.isArray(property.fotos) && property.fotos.length > 0;
  const imageSource = hasPhotos
    ? { uri: ensureHttpProtocol(property.fotos[0].url) }
    : require('../../assets/no_pic.png');

  const nights = calcNights(item.fechaInicio, item.fechaFin);
  const totalFormatted = `$${parseFloat(item.precioTotal || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress(property.id)}
      style={cardStyles.card}
    >
      <View style={cardStyles.row}>
        <Image source={imageSource} style={cardStyles.image} resizeMode="cover" />

        <View style={cardStyles.info}>
          <Text style={cardStyles.propertyName} numberOfLines={1}>
            {property.nombre}
          </Text>

          <View style={cardStyles.dateRow}>
            <Ionicons name="calendar-outline" size={13} color="#94A3B8" />
            <Text style={cardStyles.dateText}>
              {formatDateES(item.fechaInicio)} - {formatDateES(item.fechaFin)}
            </Text>
          </View>

          <View style={cardStyles.bottomRow}>
            <Text style={cardStyles.nightsText}>
              {nights} {nights === 1 ? 'Noche' : 'Noches'}
            </Text>
            <Text style={cardStyles.totalText}>{totalFormatted}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

type FilterTab = 'upcoming' | 'ongoing' | 'past';

export const MyReservationsScreen: React.FC = () => {
  const navigation = useNavigation<MyReservationsNavProp>();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { showToast, showAlert } = useNotification();
  const { reservations, isLoading, refetch } = useMyReservations();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('upcoming');
  const [sidebarAnim] = useState(() => new Animated.Value(0));

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.timing(sidebarAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSidebarOpen(false));
  };

  const handleSidebarNavigate = (screenName: string) => {
    closeSidebar();
    if (screenName === 'logout') {
      showAlert({
        title: '¿Cerrar Sesión?',
        message: '¿Estás seguro de que deseas salir de MapStay?',
        type: 'warning',
        confirmText: 'Salir',
        cancelText: 'Cancelar',
        onConfirm: async () => {
          await logout();
          showToast({ message: 'Sesión cerrada correctamente.', type: 'success' });
        },
      });
    } else if (screenName === 'home') {
      navigation.navigate('Home');
    }
  };

  const handleCardPress = useCallback((propertyId: number) => {
    navigation.navigate('PropertyDetail', { propertyId });
  }, [navigation]);

  const filteredReservations = useMemo(() => {
    return reservations.filter(
      (r) => getReservationStatus(r.fechaInicio, r.fechaFin) === activeTab
    );
  }, [reservations, activeTab]);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="calendar-outline" size={48} color="#475569" />
      </View>
      <Text style={styles.emptyTitle}>
        {activeTab === 'upcoming'
          ? 'Sin viajes próximos'
          : activeTab === 'ongoing'
          ? 'Sin estadías en curso'
          : 'Aún no tienes viajes'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming'
          ? 'Explora alojamientos increíbles y haz tu primera reserva.'
          : activeTab === 'ongoing'
          ? 'Aquí aparecerán tus reservas mientras dure tu estadía.'
          : 'Aquí verás el historial de tus estadías anteriores.'}
      </Text>
    </View>
  );

  const sidebarWidth = 280;
  const translateX = sidebarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-sidebarWidth, 0],
  });
  const overlayOpacity = sidebarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <View style={styles.container}>
      <Header
        title="Mis Reservas"
        onPressMenu={openSidebar}
        onPressLogout={() =>
          handleSidebarNavigate('logout')
        }
      />

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Próximas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ongoing' && styles.tabActive]}
          onPress={() => setActiveTab('ongoing')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.tabTextActive]}>
            En curso
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            Pasadas
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredReservations}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ReservationCard item={item} onPress={handleCardPress} />
        )}
        contentContainerStyle={[
          styles.listContent,
          filteredReservations.length === 0 && styles.listContentEmpty,
          { paddingBottom: Math.max(insets.bottom, 16) + 16 },
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.teal400}
            colors={[colors.teal400]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {sidebarOpen && (
        <>
          <Animated.View
            style={[
              styles.sidebarOverlay,
              { opacity: overlayOpacity },
            ]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar} />
          </Animated.View>

          <Animated.View
            style={[
              styles.sidebarDrawer,
              { width: sidebarWidth, transform: [{ translateX }] },
            ]}
          >
            <Sidebar
              currentRoute="bookings"
              onNavigate={handleSidebarNavigate}
              onClose={closeSidebar}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate900,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.teal400,
  },
  tabText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#64748B',
  },
  tabTextActive: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    color: colors.teal400,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: '#F1F5F9',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  sidebarOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    zIndex: 50,
  },
  sidebarDrawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 51,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.slate800,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 110,
    height: 110,
    borderTopLeftRadius: 11,
    borderBottomLeftRadius: 11,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  propertyName: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.sizes.md,
    color: '#F1F5F9',
    flexShrink: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  dateText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.sizes.xs,
    color: '#94A3B8',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  nightsText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.xs,
    color: '#64748B',
  },
  totalText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.sizes.lg,
    color: colors.teal400,
  },
});
