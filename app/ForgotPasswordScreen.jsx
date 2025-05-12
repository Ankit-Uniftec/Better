import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSignIn } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const { signIn, setActive } = useSignIn();
  const navigation = useNavigation();

  const [step, setStep] = useState(1); // 1 = email input, 2 = code input
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      Alert.alert("Success", "A verification code has been sent to your email");
      setStep(2);
    } catch (err) {
      console.error("Reset error:", err);
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong");
    }
  };

  const handleVerifyCode = async () => {
    if (!code || !newPassword) {
      Alert.alert("Error", "Please enter the code and a new password");
      return;
    }

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      await setActive({ session: result.createdSessionId });
      Alert.alert("Success", "Password reset successfully");
      navigation.navigate("MainPage");
    } catch (err) {
      console.error("Verification error:", err);
      Alert.alert("Error", err.errors?.[0]?.message || "Invalid code");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {step === 1 ? "Forgot\npassword?" : "Reset Password"}
      </Text>

      {step === 1 ? (
        <>
          <View style={styles.inputContainer}>
            <Icon
              name="email-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              placeholder="Enter your email address"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Text style={styles.infoText}>
            <Text style={styles.asterisk}>* </Text>
            We will send you an email to reset your password.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleRequestReset}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={[styles.inputContainer, styles.fieldSpacer]}>
            <Icon name="numeric" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Verification Code"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="lock-outline"
              size={20}
              color="#666"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    marginTop: 30,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F2F2F2",
    height: 48,
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginTop: 15,
    marginBottom: 24,
  },
  asterisk: {
    color: "red",
  },
  button: {
    marginTop: 15,
    backgroundColor: "#2D84E3",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  fieldSpacer: {
    marginBottom: 20,
  },
});
