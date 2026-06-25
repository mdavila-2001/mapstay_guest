import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property, getPhotoUrls } from '../types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../core/theme/theme';

export interface MapPropertyCardProps {
  readonly property: Property;
  readonly onPress: () => void;
  readonly onClose: () => void;
  readonly bottomOffset?: number;
}

const colors = COLORS.dark;

export const MapPropertyCard = React.memo(({
  property,
  onPress,
  onClose,
  bottomOffset = 0,
}: MapPropertyCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.previewCardContainer,
        { bottom: bottomOffset }
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalles de ${property.nombre}`}
    >
      <Image
        source={
          getPhotoUrls(property).length > 0
            ? { uri: getPhotoUrls(property)[0] }
            : require('../../assets/no_pic.png')
        }
        style={styles.previewCardImage}
        resizeMode="cover"
      />
      <View style={styles.previewCardDetails}>
        <Text style={styles.previewCardTitle} numberOfLines={1}>
          {property.nombre}
        </Text>
        <Text style={styles.previewCardInfo} numberOfLines={1}>
          {property.ciudad} · {property.cantPersonas} huéspedes
        </Text>
        <View style={styles.previewCardPriceRow}>
          <Text style={styles.previewCardPriceValue}>
            ${property.precioNoche}
          </Text>
          <Text style={styles.previewCardPriceLabel}>
            / noche
          </Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.previewCardCloseBtn}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Cerrar vista previa"
      >
        <Ionicons name="close" size={18} color={colors.textPrimary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

MapPropertyCard.displayName = 'MapPropertyCard';

const styles = StyleSheet.create({
  previewCardContainer: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 100,
  },
  previewCardImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.sm,
    backgroundColor: '#0F172A',
  },
  previewCardDetails: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: 24,
    justifyContent: 'center',
    gap: 4,
  },
  previewCardTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 14,
    fontWeight: '700',
    color: '#dae2fd',
  },
  previewCardInfo: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 12,
    color: '#94A3B8',
  },
  previewCardPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  previewCardPriceValue: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 16,
    fontWeight: '700',
    color: '#2DD4BF',
  },
  previewCardPriceLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.xs,
    color: '#94A3B8',
    marginLeft: 2,
  },
  previewCardCloseBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
