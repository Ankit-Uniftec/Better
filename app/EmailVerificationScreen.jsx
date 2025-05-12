import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useNavigation, useRoute } from "@react-navigation/native";

const VerifyEmail = () => {
  const { signUp, setActive } = useSignUp();
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;

  const [code, setCode] = useState("");

  const handleVerify = async () => {
    try {
      await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: signUp.createdSessionId });
      Alert.alert("Success", "Email verified!");
      navigation.navigate("PersonalInformation"); // or wherever your onboarding continues
    } catch (err) {
      console.error("Verification error:", err);
      Alert.alert(
        "Verification Failed",
        err.errors?.[0]?.message || "Try again"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>A code was sent to {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 20 },
  button: { backgroundColor: "#2D82DB", padding: 15, borderRadius: 16 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default VerifyEmail;
