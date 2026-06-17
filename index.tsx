import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationProvider } from './src/components/NotificationProvider';
import { AuthProvider } from './src/context/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import TestComponents from './src/screens/TestComponents';

type AuthScreenName = 'login' | 'register';

function AppNavigator() {
  const { user, isLoading } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreenName>('login');

  if (isLoading) {
    return (
      <View style={splashStyles.container}>
        <ActivityIndicator size="large" color="#20B2AA" />
      </View>
    );
  }

  if (!user) {
    if (authScreen === 'register') {
      return (
        <RegisterScreen
          onPressLogin={() => setAuthScreen('login')}
        />
      );
    }

    return (
      <LoginScreen
        onPressRegister={() => setAuthScreen('register')}
      />
    );
  }

  return <TestComponents />;
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Root() {
  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(Root);
