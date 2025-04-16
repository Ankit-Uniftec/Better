import React, { useEffect } from 'react';
import { View } from 'react-native';
import SplashScreen from './SplashScreen'; 
import { useNavigation } from '@react-navigation/native';

const SplashRedirect = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('OnboardingScreen1');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
};

export default SplashRedirect;
