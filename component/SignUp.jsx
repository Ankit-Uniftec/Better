

import React, { useState } from 'react';
import { useOAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';

const { width, height } = Dimensions.get('window');

const SignUp = () => {
  const navigation = useNavigation();
  const { signUp, isLoaded } = useSignUp();

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
    
  
    const handleOAuth = async (provider) => {
      try {
        await startOAuthFlow({ strategy: `oauth_${provider}` });
      } catch (err) {
        console.error(`OAuth error:`, err);
      }
    };

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        phoneNumber: mobile.startsWith('+') ? mobile : `+${mobile}`
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      Alert.alert('Success', 'Check your email to verify your account');
      navigation.navigate('SignIn');
    } catch (err) {
      console.error('Sign-up error:', err);
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an{'\n'}account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Image source={require('../Images/mail.png')} style={styles.iconRight} />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.flagWrapper}>
          <Image source={require('../Images/country.png')} style={styles.flag} />
        </View>
        <TextInput
          style={styles.inputWithFlag}
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image source={require('../Images/Vector.png')} style={styles.iconRight} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image source={require('../Images/Vector.png')} style={styles.iconRight} />
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        By creating an account, you agree to our{' '}
        <Text style={styles.link}>Terms of Service</Text> and{' '}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.or}>- OR Continue with -</Text>

      <View style={styles.socials}>
        <TouchableOpacity onPress={() => handleOAuth('google')}><Image source={require('../Images/google.png')} style={styles.socialIcon} /></TouchableOpacity>
        <TouchableOpacity onPress={() => handleOAuth('apple')}><Image source={require('../Images/apple.png')} style={styles.socialIcon} /></TouchableOpacity>
        <TouchableOpacity onPress={() => handleOAuth('facebook')}><Image source={require('../Images/f.png')} style={styles.socialIcon} /></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.login} onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.loginText}>
          I Already Have an Account <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    height: 60,
    width: 336,
  },
  inputWithFlag: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 10,
    fontSize: 16,
  },
  flagWrapper: {
    padding: 10,
  },
  flag: {
    width: 24,
    height: 18,
    borderRadius: 3,
  },
  iconRight: {
    width: 20,
    height: 20,
    tintColor: '#888',
  },
  terms: {
    fontSize: 12,
    color: '#444',
    marginBottom: 16,
  },
  link: {
    color: '#0056D2',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2D82DB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  or: {
    textAlign: 'center',
    marginBottom: 5,
    color: '#666',
  },
  socials: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  socialIcon: {
    width: 40,
    height: 35,
    resizeMode: 'contain',
  },
  login: {
    alignItems: 'center',
  },
  loginText: {
    color: '#333',
  },
});

export default SignUp;
