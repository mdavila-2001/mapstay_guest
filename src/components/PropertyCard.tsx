import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property, getPhotoUrls } from '../types';
import { PropertyImageCarousel } from './PropertyImageCarousel';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../core/theme/theme';

export interface PropertyCardProps {
  property: Property;
  onPress: () => void;
}

const colors = COLORS.dark;

export const PropertyCard: React.FC<PropertyCardProps> = React.memo(({
  property,
  onPress,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const photoUrls = getPhotoUrls(property);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.touchableWrapper}
      accessibilityRole="button"
      accessibilityLabel={`Alojamiento ${property.nombre} en ${property.ciudad}`}
    >
      <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleValue }] }]}>
        <View style={styles.imageContainer}>
          <PropertyImageCarousel photos={photoUrls} />
        </View>

        <View style={styles.detailsContainer}>

          <Text style={styles.titleText} numberOfLines={1}>
            {property.nombre}
          </Text>
          <Text style={styles.descriptionText} numberOfLines={2} ellipsizeMode="tail">
            {property.descripcion}
          </Text>

          <View style={styles.capacityRow}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} style={styles.infoIcon} />
            <Text style={styles.capacityText}>
              {property.cantPersonas} huéspedes · {property.cantHabitaciones} habitaciones
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceValueText}>
              ${property.precioNoche}
            </Text>
            <Text style={styles.priceLabelText}>
              / noche
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

PropertyCard.displayName = 'PropertyCard';

const styles = StyleSheet.create({
  touchableWrapper: {
    marginVertical: SPACING.sm,
    width: '100%',
  },
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.background,
  },
  detailsContainer: {
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 4,
  },
  reviewsText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  titleText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginVertical: 2,
  },
  descriptionText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
    height: 36,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoIcon: {
    marginRight: 6,
  },
  capacityText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  priceValueText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: '700',
    color: colors.accent,
  },
  priceLabelText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '400',
    color: colors.textSecondary,
    marginLeft: 4,
  },
});

