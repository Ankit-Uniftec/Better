import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../../component/SplashScreen';
import OnboardingScreen1 from '../../component/OnboardingScreen1';
import LoginScreen from '../../component/LoginScreen';

const Stack = createNativeStackNavigator();

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showSplash ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : (
        <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
      )}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

