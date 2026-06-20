import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotification } from '../components/NotificationProvider';
import { useAuth } from '../hooks/useAuth';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../core/theme/theme';

export interface RegisterScreenProps {
  readonly onPressMenu?: () => void;
  readonly onPressLogin?: () => void;
}

export function RegisterScreen({ onPressMenu, onPressLogin }: Readonly<RegisterScreenProps> = {}) {
  const insets = useSafeAreaInsets();
  const { showToast } = useNotification();
  const { register, isLoading } = useAuth();

  const [nombrecompleto, setNombrecompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const [focusField, setFocusField] = useState<string | null>(null);

  const handleRegisterSubmit = async () => {
    if (!nombrecompleto || !email || !telefono || !password) {
      showToast({
        message: 'Por favor, completa todos los campos obligatorios (*).',
        type: 'warning',
      });
      return;
    }

    const payload = {
      nombrecompleto,
      email,
      telefono,
      password,
    };

    const success = await register(payload);
    if (success) {
      showToast({
        message: '¡Registro exitoso! Ya puedes iniciar sesión.',
        type: 'success',
      });
      if (onPressLogin) {
        onPressLogin();
      }
    } else {
      showToast({
        message: 'Error al registrarse. Revisa tus datos e intenta nuevamente.',
        type: 'error',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContentContainer, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {onPressMenu && (
          <TouchableOpacity
            style={[styles.menuButton, { top: insets.top + 12 }]}
            onPress={onPressMenu}
            activeOpacity={0.8}
          >
            <Ionicons name="menu" size={20} color="#F8FAFC" />
          </TouchableOpacity>
        )}

        <View style={styles.brandContainer}>
          <View style={styles.logoBox}>
            <Ionicons name="trail-sign" size={40} color="#2DD4BF" />
          </View>
          <Text style={styles.brandTitle}>MapStay</Text>
          <Text style={styles.brandSubtitle}>Crea tu cuenta para comenzar</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <View style={[
                styles.inputContainer,
                focusField === 'fullname' && styles.inputContainerFocused
              ]}>
                <Ionicons name="person-outline" size={20} color="#8e9198" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Juan Pérez"
                  placeholderTextColor="#8e9198"
                  value={nombrecompleto}
                  onChangeText={setNombrecompleto}
                  onFocus={() => setFocusField('fullname')}
                  onBlur={() => setFocusField(null)}
                  selectionColor="#2DD4BF"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Correo Electrónico</Text>
              <View style={[
                styles.inputContainer,
                focusField === 'email' && styles.inputContainerFocused
              ]}>
                <Ionicons name="mail-outline" size={20} color="#8e9198" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="juan@ejemplo.com"
                  placeholderTextColor="#8e9198"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField(null)}
                  selectionColor="#2DD4BF"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <View style={[
                styles.inputContainer,
                focusField === 'phone' && styles.inputContainerFocused
              ]}>
                <Ionicons name="call-outline" size={20} color="#8e9198" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="555 123 4567"
                  placeholderTextColor="#8e9198"
                  keyboardType="numeric"
                  value={telefono}
                  onChangeText={setTelefono}
                  onFocus={() => setFocusField('phone')}
                  onBlur={() => setFocusField(null)}
                  selectionColor="#2DD4BF"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={[
                styles.inputContainer,
                focusField === 'password' && styles.inputContainerFocused
              ]}>
                <Ionicons name="lock-closed-outline" size={20} color="#8e9198" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="#8e9198"
                  secureTextEntry={secureText}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                  selectionColor="#2DD4BF"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setSecureText(!secureText)}
                  activeOpacity={0.7}
                  hitSlop={12}
                >
                  <Ionicons
                    name={secureText ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#8e9198"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegisterSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#0F172A" />
              ) : (
                <Text style={styles.submitButtonText}>Registrarse</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>
              ¿Ya tienes una cuenta?{' '}
              <Text
                style={styles.loginLink}
                onPress={onPressLogin}
              >
                Inicia sesión
              </Text>
            </Text>
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
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    zIndex: 10,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.dark.surface,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  brandTitle: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.dark.textPrimary,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    color: COLORS.dark.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  cardContainer: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.dark.textSecondary,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    backgroundColor: COLORS.dark.background,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputContainerFocused: {
    borderColor: COLORS.dark.accent,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    color: COLORS.dark.textPrimary,
    height: '100%',
    paddingVertical: 0,
  },
  passwordInput: {
    paddingRight: 36,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  submitButton: {
    height: 48,
    backgroundColor: COLORS.dark.accent,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonText: {
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.dark.background,
  },
  loginLinkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: 14,
    color: COLORS.dark.textSecondary,
  },
  loginLink: {
    fontFamily: TYPOGRAPHY.fontFamily.semibold,
    fontWeight: '600',
    color: COLORS.dark.accent,
  },
});

