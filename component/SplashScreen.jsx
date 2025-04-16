import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../Images/BetterLogo.png')} style={styles.image} />
      <Text style={styles.text}>Growth Starts</Text>
      <Text style={styles.text}>Here</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 216, // adjust as needed
    height: 63, // adjust as needed
    
    
    marginBottom: 30, // spacing between image and text
    resizeMode: 'contain',
  },
  text: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
});

