import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, TYPOGRAPHY } from '../core/theme/theme';
import { getPropertyById } from '../services/propertyService';
import { Property } from '../types/property';
import { Button } from '../components/Button';
import { MapPreview } from '../components/MapPreview';

interface PropertyDetailScreenProps {
  propertyId: number;
  onGoBack: () => void;
}

export const PropertyDetailScreen: React.FC<PropertyDetailScreenProps> = ({
  propertyId,
  onGoBack,
}) => {
  const insets = useSafeAreaInsets();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPropertyById(propertyId);
        if (active) {
          setProperty(data);
        }
      } catch (err: any) {
        console.error('Error fetching property detail:', err);
        if (active) {
          setError(err.message || 'No se pudo cargar la información detallada.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchProperty();
    return () => {
      active = false;
    };
  }, [propertyId]);

  const ensureHttpProtocol = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    const cleanUrl = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
    return `http://${cleanUrl}`;
  };

  const handleShare = async () => {
    if (!property) return;
    try {
      await Share.share({
        message: `¡Mira este hermoso alojamiento en MapStay! ${property.nombre} en ${property.ciudad}.`,
      });
    } catch (err) {
      console.warn('Error al compartir propiedad:', err);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.teal400} />
        <Text style={styles.loadingText}>Cargando detalles del alojamiento...</Text>
      </View>
    );
  }

  if (error || !property) {
    return (
      <View style={[styles.container, styles.centerContainer, { paddingHorizontal: 24 }]}>
        <Ionicons name="alert-circle-outline" size={54} color="#ffb4ab" />
        <Text style={styles.errorText}>{error || 'Error al cargar los datos.'}</Text>
        <Button text="Volver" variant="outline" size="sm" onPress={onGoBack} style={styles.backErrorBtn} />
      </View>
    );
  }

  const hasPhotos = property.fotos && property.fotos.length > 0;
  const currentPhotoUrl = hasPhotos ? property.fotos[selectedImageIndex]?.url : '';
  const heroImageSource = currentPhotoUrl
    ? { uri: ensureHttpProtocol(currentPhotoUrl) }
    : require('../../assets/no_pic.png');

  const lat = parseFloat(property.latitud) || -17.7828;
  const lng = parseFloat(property.longitud) || -63.1806;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={styles.heroSection}>
          <Image source={heroImageSource} style={styles.heroImage} />

          <View style={[styles.floatingHeader, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onGoBack}
              style={styles.circleBtn}
              accessibilityLabel="Volver"
            >
              <Ionicons name="arrow-back" size={22} color="#ffffff" />
            </TouchableOpacity>

          </View>

          {hasPhotos && property.fotos.length > 1 && (
            <View style={styles.thumbnailCarouselContainer}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={property.fotos}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.thumbnailList}
                renderItem={({ item, index }) => {
                  const isSelected = index === selectedImageIndex;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => setSelectedImageIndex(index)}
                      style={[
                        styles.thumbnailItem,
                        isSelected && styles.thumbnailItemSelected,
                      ]}
                    >
                      <Image
                        source={{ uri: ensureHttpProtocol(item.url) }}
                        style={styles.thumbnailImg}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </View>
        <View style={styles.bodyContent}>
          <View style={styles.titleSection}>
            <Text style={styles.propertyName}>{property.nombre}</Text>
            <Text style={styles.propertyCity}>{property.ciudad}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={18} color="#94A3B8" />
              <Text style={styles.statLabel}>{property.cantPersonas} Huéspedes</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="bed-outline" size={18} color="#94A3B8" />
              <Text style={styles.statLabel}>{property.cantCamas} Habitaciones</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="water-outline" size={18} color="#94A3B8" />
              <Text style={styles.statLabel}>{property.cantBanios} Baños</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="car-outline" size={18} color="#94A3B8" />
              <Text style={styles.statLabel}>{property.cantVehiculosParqueo} Parqueos</Text>
            </View>

            {property.tieneWifi === 1 && (
              <View style={styles.statItem}>
                <Ionicons name="wifi-outline" size={18} color="#94A3B8" />
                <Text style={styles.statLabel}>Wifi Disponible</Text>
              </View>
            )}
          </View>

          {property.arrendatario && (
            <View style={styles.hostCard}>
              <View style={styles.hostTextContainer}>
                <Text style={styles.hostTitle}>
                  Hospedado por:
                </Text>
                <Text style={styles.hostSubtitle}>
                  {property.arrendatario.nombrecompleto} • {property.arrendatario.telefono} • {property.arrendatario.email}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acerca de este lugar</Text>
            <Text
              style={styles.descriptionText}
              numberOfLines={isDescriptionExpanded ? undefined : 4}
            >
              {property.descripcion || 'Sin descripción disponible para este alojamiento.'}
            </Text>
            {property.descripcion && property.descripcion.length > 150 && (
              <TouchableOpacity
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                style={styles.readMoreBtn}
              >
                <Text style={styles.readMoreText}>
                  {isDescriptionExpanded ? 'Mostrar menos' : 'Leer más'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <View style={styles.mapBorderContainer}>
              <MapPreview
                latitude={lat}
                longitude={lng}
                title={property.nombre}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.stickyFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.footerPriceContainer}>
          <Text style={styles.footerPriceText}>
            ${parseFloat(property.precioNoche).toFixed(0)}{' '}
            <Text style={styles.footerPriceUnit}>/ noche</Text>
          </Text>
          <Text style={styles.footerCleanFee}>
            +${parseFloat(property.costoLimpieza || '0').toFixed(0)} limpieza
          </Text>
        </View>

        <Button
          text="Reservar"
          variant="primary"
          style={styles.reserveBtn}
          onPress={() => console.log('Iniciar reserva para', propertyId)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.slate900,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 16,
  },
  errorText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 15,
    color: '#ffb4ab',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  backErrorBtn: {
    marginTop: 20,
    minWidth: 120,
  },
  scrollContainer: {
    paddingBottom: 110,
  },
  heroSection: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  floatingHeader: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(6, 14, 32, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnailCarouselContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    height: 52,
    zIndex: 5,
  },
  thumbnailList: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  thumbnailItem: {
    width: 64,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.7,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  thumbnailItemSelected: {
    borderColor: colors.teal400,
    opacity: 1.0,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bodyContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  propertyName: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 24,
    color: '#dae2fd',
    lineHeight: 28,
  },
  propertyCity: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.slate800,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 12,
    color: '#dae2fd',
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.slate800,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    marginBottom: 20,
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostTextContainer: {
    flex: 1,
  },
  hostTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: 14,
    color: '#dae2fd',
  },
  hostSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: 18,
    color: '#dae2fd',
    marginBottom: 10,
  },
  descriptionText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 21,
  },
  readMoreBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: 14,
    color: colors.teal400,
  },
  mapBorderContainer: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapDisclaimer: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
  },
  webMapPlaceholder: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 13,
    color: '#dae2fd',
    textAlign: 'center',
    marginTop: 10,
  },
  webMapCoords: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.slate800,
    borderTopWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 16,
    zIndex: 20,
  },
  footerPriceContainer: {
    flexDirection: 'column',
  },
  footerPriceText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 20,
    color: colors.teal400,
  },
  footerPriceUnit: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    color: '#94A3B8',
  },
  footerCleanFee: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  reserveBtn: {
    minWidth: 130,
    minHeight: 46,
    paddingHorizontal: 20,
  },
  starIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
