import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Animated,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotification } from '../components/NotificationProvider';
import { useAuth } from '../hooks/useAuth';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../core/theme/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface FloatingLabelInputProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly isPassword?: boolean;
  readonly keyboardType?: 'default' | 'numeric' | 'email-address';
}

function FloatingLabelInput({
  label,
  value,
  onChangeText,
  isPassword = false,
  keyboardType = 'default',
}: Readonly<FloatingLabelInputProps>) {
  const [isFocused, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(isPassword);

  const animatedIsFocused = useRef(new Animated.Value(value === '' ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: (isFocused || value !== '') ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, animatedIsFocused]);

  const labelTop = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 6],
  });

  const labelFontSize = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 11],
  });

  const labelColor = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.dark.textSecondary, COLORS.dark.accent],
  });

  return (
    <View style={[
      styles.inputContainer,
      isFocused && styles.inputContainerFocused
    ]}>
      <Animated.Text
        style={[
          styles.floatingLabel,
          {
            top: labelTop,
            fontSize: labelFontSize,
            color: labelColor,
          }
        ]}
      >
        {label}
      </Animated.Text>

      <TextInput
        style={[
          styles.textInput,
          isPassword && styles.textInputPasswordPadding
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={secureText}
        keyboardType={keyboardType}
        autoCapitalize="none"
        selectionColor="#20B2AA"
      />

      {isPassword && (
        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
          style={styles.eyeButton}
          activeOpacity={0.7}
          hitSlop={12}
        >
          <Ionicons
            name={secureText ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#94A3B8"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

export interface LoginScreenProps {
  readonly onPressMenu?: () => void;
  readonly onPressRegister?: () => void;
}

export function LoginScreen({ onPressMenu, onPressRegister }: Readonly<LoginScreenProps> = {}) {
  const insets = useSafeAreaInsets();
  const { showToast, showAlert } = useNotification();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = async () => {
    if (!email || !password) {
      showToast({
        message: 'Por favor, completa todos los campos obligatorios (*).',
        type: 'warning',
      });
      return;
    }

    const payload = { email, password };
    console.log('API Login Request Payload JSON:', JSON.stringify(payload, null, 2));

    const success = await login(payload);
    if (success) {
      showToast({
        message: `¡Bienvenido de nuevo!`,
        type: 'success',
      });
    } else {
      showToast({
        message: 'Error al iniciar sesión. Revisa tus credenciales e intenta nuevamente.',
        type: 'error',
      });
    }
  };

  const handleRegisterRedirect = () => {
    if (onPressRegister) {
      onPressRegister();
    } else {
      showToast({
        message: 'Navegando a la pantalla de registro...',
        type: 'info',
      });
    }
  };

  const handleForgotPassword = () => {
    showAlert({
      title: 'Recuperar Contraseña',
      message: 'Se enviará un correo electrónico de recuperación a la dirección especificada si existe en nuestros registros.',
      type: 'info',
      confirmText: 'Enviar correo',
      cancelText: 'Cancelar',
      onConfirm: () => showToast({
        message: 'Enlace de recuperación enviado exitosamente.',
        type: 'success',
      }),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <Image
            source={require('../../assets/auth_background.png')}
            style={styles.heroBackground}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', '#0F172A']}
            style={styles.gradientOverlay}
            start={{ x: 0.5, y: 0.4 }}
            end={{ x: 0.5, y: 1 }}
          />

          {onPressMenu && (
            <TouchableOpacity
              style={[styles.menuButton, { top: insets.top + 12 }]}
              onPress={onPressMenu}
              activeOpacity={0.8}
            >
              <Ionicons name="menu" size={20} color="#F8FAFC" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeTitle}>¡Te damos la bienvenida!</Text>
            <Text style={styles.welcomeSubtitle}>Huésped</Text>
          </View>

          <View style={styles.formContainer}>
            <FloatingLabelInput
              label="Correo electrónico *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <FloatingLabelInput
              label="Contraseña *"
              value={password}
              onChangeText={setPassword}
              isPassword={true}
            />

            <TouchableOpacity
              onPress={handleRegisterRedirect}
              activeOpacity={0.7}
              style={styles.helperLinkContainer}
            >
              <Text style={styles.helperText}>
                ¿No tienes cuenta? <Text style={styles.helperTextHighlighted}>Registrarme</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleLoginSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#0F172A" />
              ) : (
                <Text style={styles.submitButtonText}>Iniciar sesión</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: COLORS.dark.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  heroContainer: {
    height: SCREEN_HEIGHT * 0.5,
    width: '100%',
    position: 'relative',
  },
  heroBackground: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
  },
  menuButton: {
    position: 'absolute',
    left: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  contentContainer: {
    flex: 1,
    marginTop: -64,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    backgroundColor: COLORS.dark.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SCREEN_HEIGHT * 0.05,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.dark.textPrimary,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.dark.textSecondary,
    marginTop: 6,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    height: 56,
    position: 'relative',
    backgroundColor: COLORS.dark.surface,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.sm,
    justifyContent: 'center',
  },
  inputContainerFocused: {
    borderColor: COLORS.dark.accent,
  },
  floatingLabel: {
    position: 'absolute',
    left: 14,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  textInput: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    color: COLORS.dark.textPrimary,
    paddingTop: 16,
    paddingBottom: 4,
    paddingHorizontal: 14,
  },
  textInputPasswordPadding: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperLinkContainer: {
    alignSelf: 'center',
    marginVertical: SPACING.md,
  },
  helperText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 13,
    color: COLORS.dark.textSecondary,
  },
  helperTextHighlighted: {
    color: COLORS.dark.accent,
    fontWeight: '600',
  },
  submitButton: {
    height: 48,
    backgroundColor: COLORS.dark.accent,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark.background,
  },
  forgotPasswordContainer: {
    alignSelf: 'center',
    marginVertical: SPACING.md,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 13,
    fontWeight: '500',
    color: '#dae2fd',
    textDecorationLine: 'underline',
  },
});
