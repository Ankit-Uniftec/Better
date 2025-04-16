import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ForgotPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot{'\n'}password?</Text>

      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Enter your email address"
          style={styles.input}
          keyboardType="email-address"
        />
      </View>

      <Text style={styles.infoText}>
        <Text style={styles.asterisk}>* </Text>
        We will send you an email to reset your  password
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    marginTop:30,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F2F2F2',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginTop: 15,
    marginBottom: 24,
  },
  asterisk: {
    color: 'red',
  },
  button: {
    marginTop:15,
    backgroundColor: '#2D84E3',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});