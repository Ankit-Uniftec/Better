import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useSignIn } from "@clerk/clerk-expo";

const SignInScreen = () => {
  const navigation = useNavigation();
  const { signIn, isLoaded } = useSignIn();

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const google = useOAuth({ strategy: "oauth_google" });
    const apple = useOAuth({ strategy: "oauth_apple" });
    const facebook = useOAuth({ strategy: "oauth_facebook" });

  const handleOAuth = async (strategy) => {
    try {
      if (strategy === "google") await google.startOAuthFlow();
      else if (strategy === "apple") await apple.startOAuthFlow();
      else if (strategy === "facebook") await facebook.startOAuthFlow();
    } catch (err) {
      console.error(`OAuth error:`, err);
    }
  };
  const handleSignIn = async () => {
    if (!isLoaded) return;

    try {
      await signIn.create({
        identifier: emailOrMobile,
        password: password,
      });
      navigation.navigate("MainPage"); // Or your target screen after successful login
    } catch (err) {
      console.error("Sign-in error:", err);
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.title}>Back!</Text>

      <View style={styles.inputWrapper}>
        <View style={styles.inputBox}>
          <Ionicons
            name="person"
            size={20}
            color="#555"
            style={styles.leftIcon}
          />
          <TextInput
            placeholder="Email or Mobile Number"
            placeholderTextColor="#999"
            style={styles.textInput}
            value={emailOrMobile}
            onChangeText={setEmailOrMobile}
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons
            name="lock-closed"
            size={20}
            color="#555"
            style={styles.leftIcon}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.textInput}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color="#555"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>- OR Continue with -</Text>

      <View style={styles.socials}>
        <TouchableOpacity onPress={() => handleOAuth("google")}>
          <Image
            source={require("../Images/google.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOAuth("apple")}>
          <Image
            source={require("../Images/apple.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleOAuth("facebook")}>
          <Image
            source={require("../Images/f.png")}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <Text style={{ color: "#555" }}>Create An Account </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
  },
  inputWrapper: {
    marginTop: 30,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fdfdfd",
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
    color: "#000",
  },
  eyeIcon: {
    marginLeft: 8,
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#007AFF",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#2D82DB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 20,
  },
  socials: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#007AFF",
    fontWeight: "500",
  },
});
