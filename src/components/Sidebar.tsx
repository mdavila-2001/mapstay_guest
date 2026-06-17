import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface SidebarItemProps {
  readonly title: string;
  readonly iconName: React.ComponentProps<typeof Ionicons>['name'];
  readonly isActive: boolean;
  readonly onPress: () => void;
}

// Sub-componente interno limpio para evitar redundancia de estilos en el StyleSheet
function SidebarItem({
  title,
  iconName,
  isActive,
  onPress,
}: Readonly<SidebarItemProps>) {
  const itemBgStyle = isActive ? styles.itemActiveBg : styles.itemInactiveBg;
  const textColor = isActive ? '#59dad1' : '#c4c6cf';
  const iconColor = isActive ? '#59dad1' : '#8e9198';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.itemRow, itemBgStyle]}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <Ionicons name={iconName} size={22} color={iconColor} style={styles.itemIcon} />
      <Text style={[styles.itemText, { color: textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export interface SidebarProps {
  readonly currentRoute: string;
  readonly onNavigate: (screenName: string) => void;
  readonly onClose: () => void;
}

export function Sidebar({
  currentRoute,
  onNavigate,
  onClose,
}: Readonly<SidebarProps>) {
  const insets = useSafeAreaInsets();

  const containerPaddingTop = {
    paddingTop: Math.max(insets.top, 16),
  };

  const footerPaddingBottom = {
    paddingBottom: Math.max(insets.bottom, 20),
  };

  return (
    <View style={[styles.sidebarContainer, containerPaddingTop]}>
      {/* Header del Sidebar: Logo y bienvenida */}
      <View style={styles.headerArea}>
        <View style={styles.brandingRow}>
          <Ionicons name="trail-sign" size={26} color="#59dad1" style={styles.logoIcon} />
          <Text style={styles.brandingText}>MapStay</Text>
        </View>
        <Text style={styles.welcomeText}>Huésped</Text>
        
        {/* Botón de cierre interno (flecha de colapso) */}
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeArrowButton}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Cerrar barra lateral"
        >
          <Ionicons name="chevron-back" size={20} color="#dae2fd" />
        </TouchableOpacity>
      </View>

      {/* Divisor superior sutil */}
      <View style={styles.divider} />

      {/* Lista de navegación */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeading}>Navegación</Text>
        
        <SidebarItem
          title="Inicio / Buscar Alojamientos"
          iconName={currentRoute === 'home' ? 'home' : 'home-outline'}
          isActive={currentRoute === 'home'}
          onPress={() => onNavigate('home')}
        />

        <SidebarItem
          title="Mis Reservas Históricas"
          iconName={currentRoute === 'bookings' ? 'calendar' : 'calendar-outline'}
          isActive={currentRoute === 'bookings'}
          onPress={() => onNavigate('bookings')}
        />

        <View style={styles.sectionSpace} />
        <Text style={styles.sectionHeading}>Modo Perfil</Text>

        <SidebarItem
          title="Cambiar de Cuenta / Modo Host"
          iconName="swap-horizontal-outline"
          isActive={currentRoute === 'mode-host'}
          onPress={() => onNavigate('mode-host')}
        />
      </ScrollView>

      {/* Sección de Pie (Footer): Botón de Cerrar Sesión */}
      <View style={[styles.footerArea, footerPaddingBottom]}>
        <View style={styles.divider} />
        <TouchableOpacity
          onPress={() => onNavigate('logout')}
          style={styles.logoutButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesión"
        >
          <Ionicons name="log-out-outline" size={20} color="#ffb4ab" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal de la barra lateral
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#131b2e', // surface-container-low
    width: '100%',
  },
  // Área superior de branding y bienvenida
  headerArea: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    position: 'relative',
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoIcon: {
    marginRight: 8,
  },
  brandingText: {
    fontFamily: 'Montserrat',
    fontSize: 22,
    fontWeight: '700',
    color: '#dae2fd', // on-surface
  },
  welcomeText: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '600',
    color: '#59dad1', // secondary / Sea Green
    marginLeft: 34, // Alineado debajo de MapStay
  },
  closeArrowButton: {
    position: 'absolute',
    right: 16,
    top: 22,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222a3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Separador de secciones
  divider: {
    height: 1,
    backgroundColor: '#334155', // slate-700
    width: '100%',
  },
  // Contenido con scroll
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeading: {
    fontFamily: 'Montserrat',
    fontSize: 12,
    fontWeight: '600',
    color: '#8e9198', // outline
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 8,
    paddingLeft: 4,
  },
  sectionSpace: {
    height: 16,
  },
  // Fila de la opción de navegación
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12, // rounded.md
    marginVertical: 4,
  },
  itemActiveBg: {
    backgroundColor: '#222a3d', // surface-container-high
  },
  itemInactiveBg: {
    backgroundColor: 'transparent',
  },
  itemIcon: {
    marginRight: 12,
  },
  // Botones de navegación (Inter body-md)
  itemText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
  },
  // Pie de página
  footerArea: {
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#43474e', // outline-variant
    backgroundColor: 'transparent',
    marginTop: 16,
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#ffb4ab', // error soft
  },
});
