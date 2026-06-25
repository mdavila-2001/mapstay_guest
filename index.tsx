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
import { HomeScreen } from './src/screens/HomeScreen';
import { PropertyDetailScreen } from './src/screens/PropertyDetailScreen';
import { MyReservationsScreen } from './src/screens/MyReservationsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={splashStyles.container}>
        <ActivityIndicator size="large" color="#20B2AA" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
          <Stack.Screen name="MyReservations" component={MyReservationsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onPressRegister={() => props.navigation.navigate('Register')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => (
              <RegisterScreen
                {...props}
                onPressLogin={() => props.navigation.navigate('Login')}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
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
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(Root);

