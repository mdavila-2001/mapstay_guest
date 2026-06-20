import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../core/theme/theme';

export interface MapPreviewProps {
  latitude: number;
  longitude: number;
  title?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  latitude,
  longitude,
  title,
}) => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }}
      scrollEnabled={false}
      zoomEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
    >
      <Marker
        coordinate={{ latitude, longitude }}
        title={title}
      >
        <View style={styles.mapMarker}>
          <Ionicons name="location" size={26} color={colors.teal400} />
        </View>
      </Marker>
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default MapPreview;
