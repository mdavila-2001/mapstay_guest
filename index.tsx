import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { NotificationProvider } from './src/components/NotificationProvider';
import { AuthProvider } from './src/context/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import TestComponents from './src/screens/TestComponents';
import { HomeScreen } from './src/screens/HomeScreen';
import { PropertyDetailScreen } from './src/screens/PropertyDetailScreen';

type AuthScreenName = 'login' | 'register';
type AppRouteName = 'home' | 'showcase' | 'property-detail';

function AppNavigator() {
  const { user, isLoading } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreenName>('login');
  const [currentRoute, setCurrentRoute] = useState<AppRouteName>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

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

  if (currentRoute === 'showcase') {
    return <TestComponents onNavigateToHome={() => setCurrentRoute('home')} />;
  }

  if (currentRoute === 'property-detail' && selectedPropertyId !== null) {
    return (
      <PropertyDetailScreen
        propertyId={selectedPropertyId}
        onGoBack={() => setCurrentRoute('home')}
      />
    );
  }

  return (
    <HomeScreen
      onNavigateToShowcase={() => setCurrentRoute('showcase')}
      onNavigateToPropertyDetail={(id) => {
        setSelectedPropertyId(id);
        setCurrentRoute('property-detail');
      }}
    />
  );
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
  const [fontsLoaded] = useFonts({
    'Poppins-Light': Poppins_300Light,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    // Compatibilidad para evitar Times New Roman
    'Inter': Poppins_400Regular,
    'Montserrat': Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={splashStyles.container}>
        <ActivityIndicator size="large" color="#20B2AA" />
      </View>
    );
  }

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

