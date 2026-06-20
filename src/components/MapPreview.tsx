import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface MapPreviewProps {
  latitude: number;
  longitude: number;
  title?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  latitude,
  longitude,
}) => {
  return (
    <View style={styles.webMapPlaceholder}>
      <Ionicons name="map-outline" size={40} color="#94A3B8" />
      <Text style={styles.webMapText}>
        Ubicación georreferenciada: Santa Cruz, Bolivia.
      </Text>
      <Text style={styles.webMapCoords}>
        Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  webMapPlaceholder: {
    flex: 1,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: '100%',
  },
  webMapText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#dae2fd',
    textAlign: 'center',
    marginTop: 10,
  },
  webMapCoords: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
});
