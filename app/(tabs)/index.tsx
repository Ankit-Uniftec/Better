import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashRedirect from '../../component/SplashRedirect';
import OnboardingScreen1 from '../../component/OnboardingScreen1';
import LoginScreen from '../../component/LoginScreen';
import SignUp from '../../component/SignUp';

const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashRedirect} /> 
      <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});




