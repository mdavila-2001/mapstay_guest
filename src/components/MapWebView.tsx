import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { COLORS } from '../core/theme/theme';

const colors = COLORS.dark;

export interface MapMarker {
  id: number | string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
}

export interface MapWebViewProps {
  readonly markers: MapMarker[];
  readonly initialRegion: { latitude: number; longitude: number };
  readonly initialZoom?: number;
  readonly userLocation?: { latitude: number; longitude: number } | null;
  readonly onMarkerPress?: (id: number | string) => void;
  readonly accentColor?: string;
}

function buildHtml(lat: number, lng: number, zoom: number, accent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body { height: 100%; margin: 0; padding: 0; }
  #map { height: 100%; width: 100%; background: ${colors.background}; }
  .pin {
    width: 18px; height: 18px; border-radius: 50%;
    background: ${accent}; border: 3px solid #FFFFFF;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.35);
  }
  .leaflet-popup-content { font-family: -apple-system, Roboto, Helvetica, sans-serif; font-size: 13px; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  (function () {
    function post(obj) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(obj));
      }
    }
    try {
      var map = L.map('map', { zoomControl: false, attributionControl: true })
        .setView([${lat}, ${lng}], ${zoom});

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      var pinIcon = L.divIcon({
        className: '',
        html: '<div class="pin"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      var markerLayer = L.layerGroup().addTo(map);
      var userLayer = L.layerGroup().addTo(map);

      function escapeHtml(value) {
        return String(value == null ? '' : value)
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }

      window.__setMarkers = function (list) {
        markerLayer.clearLayers();
        list.forEach(function (p) {
          var marker = L.marker([p.lat, p.lng], { icon: pinIcon }).addTo(markerLayer);
          var html = '<b>' + escapeHtml(p.title) + '</b>' +
            (p.subtitle ? '<br/>' + escapeHtml(p.subtitle) : '');
          marker.bindPopup(html);
          marker.on('click', function () { post({ type: 'markerPress', id: p.id }); });
        });
      };

      window.__setView = function (lat, lng, zoom) {
        map.setView([lat, lng], zoom || map.getZoom());
      };

      window.__setUser = function (lat, lng) {
        userLayer.clearLayers();
        if (lat == null || lng == null) return;
        L.circleMarker([lat, lng], {
          radius: 7, color: '#FFFFFF', weight: 2, fillColor: '#3B82F6', fillOpacity: 1
        }).addTo(userLayer);
      };

      map.whenReady(function () { post({ type: 'ready' }); });
    } catch (e) {
      post({ type: 'error', message: String(e) });
    }
  })();
  true;
</script>
</body>
</html>`;
}

export function MapWebView({
  markers,
  initialRegion,
  initialZoom = 12,
  userLocation = null,
  onMarkerPress,
  accentColor = colors.accent,
}: Readonly<MapWebViewProps>) {
  const webRef = useRef<WebView>(null);
  const [ready, setReady] = useState(false);

  const initialCenter = useRef(initialRegion).current;
  const html = useMemo(
    () => buildHtml(initialCenter.latitude, initialCenter.longitude, initialZoom, accentColor),
    [initialCenter, initialZoom, accentColor]
  );

  const inject = useCallback((code: string) => {
    webRef.current?.injectJavaScript(`${code} true;`);
  }, []);

  useEffect(() => {
    if (!ready) return;
    inject(`window.__setMarkers && window.__setMarkers(${JSON.stringify(markers)});`);
  }, [ready, markers, inject]);

  useEffect(() => {
    if (!ready || !userLocation) return;
    inject(`window.__setUser && window.__setUser(${userLocation.latitude}, ${userLocation.longitude});`);
    inject(`window.__setView && window.__setView(${userLocation.latitude}, ${userLocation.longitude}, 14);`);
  }, [ready, userLocation, inject]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'ready') {
        setReady(true);
      } else if (msg.type === 'markerPress' && onMarkerPress) {
        onMarkerPress(msg.id);
      }
    } catch {
      // Mensaje no JSON: se ignora
    }
  };

  return (
    <WebView
      ref={webRef}
      style={styles.webview}
      originWhitelist={['*']}
      source={{ html }}
      onMessage={handleMessage}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      renderLoading={() => (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
