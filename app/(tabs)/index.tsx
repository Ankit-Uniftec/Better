import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashRedirect from '../../component/SplashRedirect';
import OnboardingScreen1 from '../../component/OnboardingScreen1';
import LoginScreen from '../LoginScreen';
import SignUp from '../../component/SignUp';
import SignIn from '../../component/SignIn';
import ForgotPasswordScreen from '../../component/ForgotPasswordScreen';
import PersonalInformation from '../../component/PersonalInformation';
import LibraryScreen from '../../component/LibraryScreen'; 
import CreateListScreen from '../../component/CreateListScreen'; 
import MainPage from '../../component/MainPage'


const Stack = createNativeStackNavigator();

const Index = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashRedirect} />
      <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="PersonalInformation" component={PersonalInformation} /> 
      <Stack.Screen name="LibraryScreen" component={LibraryScreen} />
      <Stack.Screen name="CreateListScreen" component={CreateListScreen} />
      <Stack.Screen name="MainPage" component={MainPage} />

    </Stack.Navigator>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
