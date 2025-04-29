
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { Slot, useRouter } from 'expo-router';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { View, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  const colorScheme = useColorScheme();

  const [appReady, setAppReady] = useState(false);
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!publishableKey || !fontsLoaded || !appReady) return null;

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <AuthGate>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style="auto" />
          <Slot />
        </ThemeProvider>
      </AuthGate>
    </ClerkProvider>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoaded || !userLoaded) return;

    if (!isSignedIn) {
      router.replace('/LoginScreen');
    } else {
      const { firstName, lastName, publicMetadata } = user || {};
      const { gender, birthday } = publicMetadata || {};

      const isProfileComplete =
        !!firstName && !!lastName && !!gender && !!birthday;

      if (!isProfileComplete) {
        router.replace('/PersonalInformation');
      } else {
        router.replace('/MainPage');
      }
    }
  }, [authLoaded, userLoaded, isSignedIn]);

  if (!authLoaded || !userLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}