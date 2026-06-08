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

export interface CustomModalProps {
  /**
   * Controlled visibility state.
   */
  visible: boolean;

  /**
   * Callback triggered when the modal requests closure (backdrop click, close button, or hardware back button).
   */
  onClose: () => void;

  /**
   * Optional header title text.
   */
  title?: string;

  /**
   * Presentation variant type.
   * - `'fade'`: Centered Dialog overlay (default).
   * - `'slide'`: Bottom Sheet overlay.
   * @default 'fade'
   */
  type?: 'slide' | 'fade';

  /**
   * Content inside the modal container.
   */
  children: React.ReactNode;

  /**
   * Optional style overrides for the modal content card container.
   */
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
      {/* Absolute Backdrop overlay */}
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Modal card container */}
        <View
          style={[
            isBottomSheet ? styles.bottomSheet : styles.dialog,
            isBottomSheet && { paddingBottom: Math.max(insets.bottom, 24) },
            containerStyle,
          ]}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            {title ? (
              <Text numberOfLines={1} style={styles.headerTitle}>
                {title}
              </Text>
            ) : (
              <View style={styles.flexSpacer} />
            )}

            {/* Close Icon Button */}
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

          {/* Thin slate divider line */}
          <View style={styles.divider} />

          {/* Scrollable/Plain Content container */}
          <View style={styles.contentWrapper}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Overlay backdrop based on surface-container-lowest opacity spec
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 14, 32, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Centered Dialog Variant Layout (surface-container)
  dialog: {
    width: '88%',
    maxWidth: 400,
    backgroundColor: '#171f33',
    borderRadius: 12, // rounded.md
    borderWidth: 1,
    borderColor: '#334155', // slate-700
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

  // Bottom Sheet Variant Layout (surface-container-high)
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#222a3d',
    borderTopLeftRadius: 12,  // rounded.md top-left
    borderTopRightRadius: 12, // rounded.md top-right
    borderTopWidth: 1,
    borderTopColor: '#334155', // slate-700
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

  // Header components styles
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  headerTitle: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    fontWeight: '600',
    color: '#dae2fd', // on-surface
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

  // Separation divider style (slate-700 divider spec)
  divider: {
    height: 1,
    backgroundColor: '#334155', // slate-700
    width: '100%',
  },

  // Content body wrapper
  contentWrapper: {
    padding: 16,
  },
});
