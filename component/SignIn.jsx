import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

const SignInScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.title}>Back!</Text>

      {/* Inputs */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputBox}>
          <Ionicons name="person" size={20} color="#555" style={styles.leftIcon} />
          <TextInput
            placeholder="Email or Mobile Number"
            placeholderTextColor="#999"
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed" size={20} color="#555" style={styles.leftIcon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.textInput}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="#555"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* OR */}
      <Text style={styles.orText}>- OR Continue with -</Text>

      {/* Social Icons */}
      <View style={styles.socials}>
              <TouchableOpacity><Image source={require('../Images/google.png')} style={styles.socialIcon} /></TouchableOpacity>
              <TouchableOpacity><Image source={require('../Images/apple.png')} style={styles.socialIcon} /></TouchableOpacity>
              <TouchableOpacity><Image source={require('../Images/f.png')} style={styles.socialIcon} /></TouchableOpacity>
    </View>

      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <Text style={{ color: '#555' }}>Create An Account </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000',
  },
  inputWrapper: {
    marginTop: 30,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 16,
  },
  leftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    marginLeft: 8,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#2D82DB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
  socials: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});