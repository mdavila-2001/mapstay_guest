import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TYPOGRAPHY } from '../core/theme/theme';

export interface CustomModalProps {

  visible: boolean;

  onClose: () => void;

  title?: string;

  type?: 'slide' | 'fade';

  children: React.ReactNode;

  containerStyle?: StyleProp<ViewStyle>;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  type = 'fade',
  children,
  containerStyle,
}) => {
  const insets = useSafeAreaInsets();
  const isBottomSheet = type === 'slide';

  return (
    <Modal
      transparent
      visible={visible}
      animationType={type}
      onRequestClose={onClose}
      statusBarTranslucent
    >

      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            isBottomSheet ? styles.bottomSheet : styles.dialog,
            isBottomSheet && { paddingBottom: Math.max(insets.bottom, 24) },
            containerStyle,
          ]}
        >

          <View style={styles.headerRow}>
            {title ? (
              <Text numberOfLines={1} style={styles.headerTitle}>
                {title}
              </Text>
            ) : (
              <View style={styles.flexSpacer} />
            )}

            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Cerrar modal"
            >
              <Ionicons name="close" size={22} color="#94a3b8" />
            </Pressable>
          </View>

          <View style={styles.divider} />

          <View style={styles.contentWrapper}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 14, 32, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dialog: {
    width: '88%',
    maxWidth: 400,
    backgroundColor: '#171f33',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#222a3d',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: '600',
    color: '#dae2fd',
    flex: 1,
    marginRight: 10,
  },

  flexSpacer: {
    flex: 1,
  },

  closeBtn: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#334155',
    width: '100%',
  },

  contentWrapper: {
    padding: 16,
  },
});

