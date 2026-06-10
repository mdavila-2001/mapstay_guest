import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

export type NotificationType = 'success' | 'warning' | 'info' | 'error';

export interface ToastOptions {
  readonly message: string;
  readonly type: NotificationType;
  readonly duration?: number;
}

export interface AlertOptions {
  readonly title: string;
  readonly message: string;
  readonly type?: NotificationType;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly onConfirm: () => void;
  readonly onCancel?: () => void;
}

export interface NotificationContextProps {
  readonly showToast: (options: ToastOptions) => void;
  readonly showAlert: (options: AlertOptions) => void;
  readonly hideToast: () => void;
  readonly hideAlert: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export interface NotificationProviderProps {
  readonly children: React.ReactNode;
}

export function NotificationProvider({ children }: Readonly<NotificationProviderProps>) {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const dismissToast = useCallback(() => {
    Animated.timing(toastAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
    });
  }, [toastAnim]);

  const showToast = useCallback((options: ToastOptions) => {
    // Limpiar temporizadores previos
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast(options);
    toastAnim.setValue(0);

    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const duration = options.duration ?? 3000;
    toastTimeoutRef.current = setTimeout(() => {
      dismissToast();
    }, duration);
  }, [dismissToast, toastAnim]);

  const hideToast = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    dismissToast();
  }, [dismissToast]);

  const showAlert = useCallback((options: AlertOptions) => {
    setAlert(options);
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  // Limpiar temporizadores al desmontar el componente
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Gestores de confirmación / cancelación para la Alerta
  const handleAlertConfirm = () => {
    if (alert) {
      alert.onConfirm();
    }
    hideAlert();
  };

  const handleAlertCancel = () => {
    if (alert?.onCancel) {
      alert.onCancel();
    }
    hideAlert();
  };

  const getSemanticColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return '#20B2AA'; // success-green accent
      case 'warning':
        return '#F59E0B'; // warning amber
      case 'error':
        return '#EF4444'; // error-red
      case 'info':
      default:
        return '#7bd0ff'; // info blue
    }
  };

  const getSemanticIcon = (type: NotificationType): React.ComponentProps<typeof Ionicons>['name'] => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'skull'; // Calavera logo
      case 'info':
      default:
        return 'information-circle';
    }
  };

  // Interpolación de animaciones para Toasts (entrada suave desde el tope de la pantalla)
  const translateY = toastAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 0],
  });
  const opacity = toastAnim;

  const topInsetStyle = {
    marginTop: Math.max(insets.top, 16),
  };

  const activeColor = toast ? getSemanticColor(toast.type) : '#7bd0ff';
  const activeIconName = toast ? getSemanticIcon(toast.type) : 'information-circle';

  // Memoizar el valor del contexto para prevenir renderizados innecesarios en los consumidores
  const contextValue = useMemo(() => ({
    showToast,
    showAlert,
    hideToast,
    hideAlert,
  }), [showToast, showAlert, hideToast, hideAlert]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {/* Overlay absoluto de Toasts (no bloqueante gracias a pointerEvents="box-none") */}
      <View style={styles.toastOverlayContainer} pointerEvents="box-none">
        {toast && (
          <Animated.View
            style={[
              styles.toastCard,
              topInsetStyle,
              {
                opacity,
                transform: [{ translateY }],
                borderLeftColor: activeColor,
              },
            ]}
          >
            <Ionicons name={activeIconName} size={22} color={activeColor} style={styles.toastIcon} />
            <Text numberOfLines={3} style={styles.toastText}>
              {toast.message}
            </Text>
            <Pressable onPress={hideToast} hitSlop={8} style={styles.toastCloseButton}>
              <Ionicons name="close" size={18} color="#94a3b8" />
            </Pressable>
          </Animated.View>
        )}
      </View>

      {/* Overlay de Alertas críticas (modal centrado bloqueante) */}
      <Modal
        transparent
        visible={alert !== null}
        animationType="fade"
        onRequestClose={handleAlertCancel}
        statusBarTranslucent
      >
        <View style={styles.alertOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleAlertCancel} />
          {alert && (
            <View style={styles.alertCard}>
              {/* Icono semántico de cabecera */}
              <View style={styles.alertHeaderContainer}>
                <Ionicons
                  name={getSemanticIcon(alert.type ?? 'info')}
                  size={36}
                  color={getSemanticColor(alert.type ?? 'info')}
                />
              </View>

              {/* Título y Mensaje descriptivo */}
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>

              {/* Fila de Botones de Acción */}
              <View style={styles.alertActionsRow}>
                {alert.onCancel && (
                  <Button
                    text={alert.cancelText ?? 'Cancelar'}
                    variant="outline"
                    style={styles.alertButton}
                    onPress={handleAlertCancel}
                  />
                )}
                <Button
                  text={alert.confirmText ?? 'Confirmar'}
                  variant="primary"
                  style={[
                    styles.alertButton,
                    alert.type === 'error' && styles.alertButtonErrorBorder,
                  ]}
                  textStyle={alert.type === 'error' ? styles.alertButtonErrorText : undefined}
                  onPress={handleAlertConfirm}
                />
              </View>
            </View>
          )}
        </View>
      </Modal>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser utilizado dentro de un NotificationProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  // Contenedor Toast absoluto
  toastOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  // Tarjeta Toast (#222a3d, rounded 12px, outline 1px #43474e)
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222a3d',
    borderWidth: 1,
    borderColor: '#43474e',
    borderLeftWidth: 4,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '90%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  toastIcon: {
    marginRight: 12,
  },
  toastText: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#dae2fd',
    flex: 1,
    lineHeight: 18,
  },
  toastCloseButton: {
    marginLeft: 8,
    padding: 2,
  },

  // Contenedor Modal de Alerta
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 14, 32, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // Tarjeta Alerta (#222a3d, rounded 12px, outline 1px #43474e)
  alertCard: {
    backgroundColor: '#222a3d',
    borderWidth: 1,
    borderColor: '#43474e',
    borderRadius: 12,
    padding: 20,
    width: '88%',
    maxWidth: 340,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  alertHeaderContainer: {
    marginBottom: 12,
  },
  alertTitle: {
    fontFamily: 'Montserrat',
    fontSize: 17,
    fontWeight: '600',
    color: '#dae2fd',
    textAlign: 'center',
    marginBottom: 10,
  },
  alertMessage: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#c4c6cf',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  alertActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  alertButton: {
    flex: 1,
    marginHorizontal: 6,
    minHeight: 40,
  },
  alertButtonErrorBorder: {
    borderColor: '#EF4444',
  },
  alertButtonErrorText: {
    color: '#EF4444',
  },
});
