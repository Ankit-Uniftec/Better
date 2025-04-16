import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width,height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image 
       source={require('../Images/better.png')}
      />

      <Image
        source={require('../Images/dotImage.png')}
        style={styles.logoImage}
      />

      <Text style={styles.heading}>Learn More in Less Time</Text>

      <Text style={styles.subheading}>
        You’re just one step away from unlocking curated insights from the leading personal growth YouTube videos.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Image source={require('../Images/google.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Image source={require('../Images/apple.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Image source={require('../Images/f.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}> 
        <Text style={styles.emailSignup}>Sign Up with email</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        By continuing, you agree to our <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>
    </View>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#377DFF',
      alignItems: 'center',
      paddingTop: 80,
      paddingHorizontal: 20,
    },
    logoImage: {
      width: 110,
      height: 110,
      marginBottom: height*0.001,
      borderRadius:100,
      marginTop:20
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginTop: 20,
    },
    subheading: {
      fontSize: 14,
      color: '#e0e0e0',
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 30,
      marginBottom: 15,
      width: width * 0.9,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
      height: 50
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 15,
      
    },
    buttonText: {
      fontSize: 20,
      color: '#000',
      marginLeft:20
    },
    emailSignup: {
      marginTop: 10,
      color: '#fff',
      fontWeight: '600',
    },
    footerText: {
      fontSize: 12,
      color: '#e0e0e0',
      textAlign: 'center',
      marginTop: 30,
    },
    linkText: {
      textDecorationLine: 'underline',
      fontWeight: '600',
    },
  });