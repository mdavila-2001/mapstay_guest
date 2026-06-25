import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { COLORS } from '../core/theme/theme';

const colors = COLORS.dark;
const NO_PIC = require('../../assets/no_pic.png');

export interface PropertyImageCarouselProps {
  readonly photos: string[];
}

export function PropertyImageCarousel({ photos }: Readonly<PropertyImageCarouselProps>) {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <Image source={NO_PIC} style={styles.image} resizeMode="cover" />
    );
  }

  if (photos.length === 1) {
    return (
      <Image source={{ uri: photos[0] }} style={styles.image} resizeMode="cover" />
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width === 0) return;
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {photos.map((uri, index) => (
          <Image
            key={`${uri}-${index}`}
            source={{ uri }}
            style={[styles.image, { width }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={[styles.dotsContainer, { pointerEvents: 'none' }]}>
        {photos.map((uri, index) => (
          <View
            key={`dot-${uri}-${index}`}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accent,
  },
});
