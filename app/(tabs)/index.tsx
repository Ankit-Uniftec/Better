import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashRedirect from '../SplashRedirect';
import OnboardingScreen1 from '../OnboardingScreen1';
import LoginScreen from '../LoginScreen';
import SignUp from '../SignUp';
import SignIn from '../SignIn';
import ForgotPasswordScreen from '../ForgotPasswordScreen';
import PersonalInformation from '../PersonalInformation';
import LibraryScreen from '../LibraryScreen'; 
import CreateListScreen from '../CreateListScreen'; 
import MainPage from '../MainPage'
import InterestArea from '../InterestArea'
import LinkSummarizer from '../LinkSummarizer'
import Notification from '../Notification';
import Profile from '../Profile';
import Setting from '../Setting';
import Signout from '../Signout';
import UploadScreen from '../UploadScreen'

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
      <Stack.Screen name="InterestArea" component={InterestArea} />
      <Stack.Screen name="LinkSummarizer" component={LinkSummarizer} />
      <Stack.Screen name="Notification" component={Notification}/>
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name='Setting' component={Setting}/>
      <Stack.Screen name='Signout' component={Signout}/>
      <Stack.Screen name='UploadScreen' component={UploadScreen}/>
    </Stack.Navigator>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
