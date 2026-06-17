import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export interface HeaderProps {
  readonly title: string;
  readonly onPressMenu: () => void;
  readonly onPressLogout: () => void;
}

export function Header({
  title,
  onPressMenu,
  onPressLogout,
}: Readonly<HeaderProps>) {
  const insets = useSafeAreaInsets();

  const containerPaddingTop = {
    paddingTop: insets.top,
  };

  return (
    <View style={[styles.headerContainer, containerPaddingTop]}>
      <View style={styles.headerContent}>
        {/* Left Side: Hamburger Menu Button */}
        <TouchableOpacity
          onPress={onPressMenu}
          style={styles.actionButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Abrir menú de navegación"
        >
          <Ionicons name="menu" size={24} color="#dae2fd" />
        </TouchableOpacity>

        {/* Center: Centered Title Text */}
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.titleText}>
            {title}
          </Text>
        </View>

        {/* Right Side: Log Out Button */}
        <TouchableOpacity
          onPress={onPressLogout}
          style={styles.actionButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <Ionicons name="log-out" size={24} color="#dae2fd" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal con elevación de color y borde divisor inferior
  headerContainer: {
    backgroundColor: '#171f33', // surface-container
    borderBottomWidth: 1,
    borderBottomColor: '#334155', // slate-700 / outline-variant
  },
  // Contenedor base de contenido para centrado y alineación simétrica
  headerContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  // Botones laterales simétricos con ancho fijo para garantizar centrado perfecto
  actionButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Contenedor del título con espacio flexible
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  // Estilo de tipografía Montserrat h3
  titleText: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: '600',
    color: '#dae2fd', // on-surface
    textAlign: 'center',
  },
});
