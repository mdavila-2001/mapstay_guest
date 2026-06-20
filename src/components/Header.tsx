import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY } from '../core/theme/theme';

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

        <TouchableOpacity
          onPress={onPressMenu}
          style={styles.actionButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Abrir menú de navegación"
        >
          <Ionicons name="menu" size={24} color="#dae2fd" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.titleText}>
            {title}
          </Text>
        </View>

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

  headerContainer: {
    backgroundColor: '#171f33',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },

  headerContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },

  actionButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  titleText: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: '600',
    color: '#dae2fd',
    textAlign: 'center',
  },
});

