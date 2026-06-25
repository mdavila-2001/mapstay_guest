import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../core/theme/theme';

export interface MapPreviewProps {
  latitude: number;
  longitude: number;
  title?: string;
}

function buildPreviewHtml(lat: number, lng: number, accent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body { height: 100%; margin: 0; padding: 0; }
  #map { height: 100%; width: 100%; background: #0F172A; }
  .pin {
    width: 14px; height: 14px; border-radius: 50%;
    background: ${accent}; border: 3px solid #FFFFFF;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.35);
  }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  try {
    var map = L.map('map', { 
      zoomControl: false, 
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
      boxZoom: false,
      touchZoom: false
    }).setView([${lat}, ${lng}], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    var pinIcon = L.divIcon({
      className: '',
      html: '<div class="pin"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    L.marker([${lat}, ${lng}], { icon: pinIcon }).addTo(map);
  } catch (e) {
    document.body.innerHTML = '<div style="color:white;padding:20px;">Error: ' + e + '</div>';
  }
</script>
</body>
</html>`;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  latitude,
  longitude,
}) => {
  const html = useMemo(() => buildPreviewHtml(latitude, longitude, colors.teal400), [latitude, longitude]);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});

export default MapPreview;
