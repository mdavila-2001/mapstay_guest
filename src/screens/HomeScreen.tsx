import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Pressable,
  Animated,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';


import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { PropertyCard } from '../components/PropertyCard';
import { MapView } from '../components/MapView';
import { AdvancedFilterModal } from '../components/AdvancedFilterModal';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MapPropertyCard } from '../components/MapPropertyCard';

import { useProperties } from '../hooks/useProperties';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/NotificationProvider';
import { AdvancedSearchPayload, Property } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../core/theme/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const colors = COLORS.dark;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { showToast, showAlert } = useNotification();

  const { properties, isLoading, error, refetch, fetchAdvanced } = useProperties();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [ciudad, setCiudad] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState({
    latitude: -17.7828,
    longitude: -63.1806,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  });

  useEffect(() => {
    if (viewMode === 'map') {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            setHasLocationPermission(true);
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            setUserLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
            setRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.06,
              longitudeDelta: 0.06,
            });
          } else {
            showToast({
              message: 'Permiso de ubicación denegado. Usando ubicación predeterminada.',
              type: 'warning',
            });
          }
        } catch (err: unknown) {
          console.warn('Error al solicitar permisos o ubicación:', err);
        }
      })();
    }
  }, [viewMode, showToast]);

  const sidebarAnim = React.useRef(new Animated.Value(0)).current;

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
    }).start(() => {
      setSidebarOpen(false);
    });
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
    } else if (screenName === 'bookings') {
      navigation.navigate('MyReservations');
    } else {
      showToast({ message: `Navegando a: ${screenName}`, type: 'info' });
    }
  };

  const handleSimpleSearch = () => {
    setSelectedProperty(null);
    refetch(ciudad);
  };

  const handleApplyFilters = (filters: AdvancedSearchPayload) => {
    setSelectedProperty(null);
    fetchAdvanced(filters);
  };

  const mapMarkers = useMemo(
    () =>
      properties
        .map((prop) => ({
          id: prop.id,
          lat: Number(prop.latitud),
          lng: Number(prop.longitud),
          title: prop.nombre,
          subtitle: `$${prop.precioNoche} / noche`,
        }))
        .filter((m) => !Number.isNaN(m.lat) && !Number.isNaN(m.lng) && m.lat !== 0 && m.lng !== 0),
    [properties]
  );

  const handleMarkerPress = (id: number | string) => {
    const prop = properties.find((p) => p.id === id);
    if (prop) {
      setSelectedProperty(prop);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando alojamientos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Button
            text="Reintentar"
            variant="outline"
            size="sm"
            onPress={() => refetch(ciudad)}
            style={{ marginTop: SPACING.md }}
          />
        </View>
      );
    }

    if (viewMode === 'list') {
      return (
        <FlatList
          data={properties}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onPress={() => {
                navigation.navigate('PropertyDetail', { propertyId: item.id });
              }}
            />
          )}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No se encontraron alojamientos disponibles.</Text>
            </View>
          }
        />
      );
    }

    return (
      <View style={styles.mapWrapper}>
        {Platform.OS === 'web' ? (
          <View style={styles.webMapPlaceholder}>
            <Ionicons name="map-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.webMapText}>
              El mapa interactivo de OpenStreetMap está optimizado para dispositivos móviles.
            </Text>
            <Text style={styles.webMapSubtext}>
              Mostrando {properties.length} alojamientos georreferenciados.
            </Text>
          </View>
        ) : (
          <MapView
            markers={mapMarkers}
            initialRegion={region}
            userLocation={hasLocationPermission ? userLocation : null}
            onMarkerPress={handleMarkerPress}
            accentColor={colors.accent}
          />
        )}

        {selectedProperty && (
          <MapPropertyCard
            property={selectedProperty}
            onPress={() => navigation.navigate('PropertyDetail', { propertyId: selectedProperty.id })}
            onClose={() => setSelectedProperty(null)}
            bottomOffset={Math.max(insets.bottom, 16) + 16 + 44 + 12}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Header
        title="Buscar Alojamientos"
        onPressMenu={openSidebar}
        onPressLogout={() => handleSidebarNavigate('logout')}
      />

      <View style={styles.searchSection}>
        <View style={styles.searchBarRow}>
          <View style={styles.searchInputWrapper}>
            <Input
              variant="text"
              placeholder="Buscar por ciudad... (ej. Santa Cruz)"
              value={ciudad}
              onValueChange={(val) => setCiudad(val as string)}
              iconName="location-outline"
              containerStyle={styles.searchFieldContainer}
              inputContainerStyle={styles.searchInputBox}
            />
          </View>

          {viewMode === 'map' && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setFilterModalVisible(true)}
              style={styles.floatingFilterBtn}
              accessibilityLabel="Filtros avanzados"
            >
              <Ionicons name="filter" size={20} color="#003734" />
            </TouchableOpacity>
          )}

          <Button
            text="Buscar"
            variant="primary"
            size="sm"
            onPress={handleSimpleSearch}
            style={styles.searchBtn}
          />
        </View>
      </View>

      <View style={styles.contentArea}>
        {renderContent()}
      </View>

      <View style={[styles.toggleContainer, { bottom: Math.max(insets.bottom, 16) + 16 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
          onPress={() => {
            setViewMode('list');
            setSelectedProperty(null);
          }}
        >
          <Ionicons
            name={viewMode === 'list' ? 'list' : 'list-outline'}
            size={16}
            color={viewMode === 'list' ? '#003734' : colors.textPrimary}
          />
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            Lista
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
          onPress={() => {
            setViewMode('map');
          }}
        >
          <Ionicons
            name={viewMode === 'map' ? 'map' : 'map-outline'}
            size={16}
            color={viewMode === 'map' ? '#003734' : colors.textPrimary}
          />
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Mapa
          </Text>
        </TouchableOpacity>
      </View>

      <AdvancedFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        currentCiudad={ciudad}
      />

      {sidebarOpen && (
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={styles.sidebarBackdrop} onPress={closeSidebar} />
          <Animated.View
            style={[
              styles.sidebarDrawer,
              {
                transform: [
                  {
                    translateX: sidebarAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-280, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Sidebar
              currentRoute="home"
              onNavigate={handleSidebarNavigate}
              onClose={closeSidebar}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  searchSection: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchFieldContainer: {
    marginBottom: 0,
  },
  searchInputBox: {
    height: 44,
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  searchBtn: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  floatingFilterBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contentArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: SPACING.sm,
  },
  errorText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: colors.error,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  listContainer: {
    padding: SPACING.md,
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  mapWrapper: {
    flex: 1,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: '#0F172A',
  },
  webMapText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  webMapSubtext: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  toggleContainer: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.round,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
    zIndex: 99,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.round,
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: colors.accent,
  },
  toggleText: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  toggleTextActive: {
    color: '#003734',
  },
  sidebarBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 999,
  },
  sidebarDrawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 280,
    zIndex: 1000,
  },
});
