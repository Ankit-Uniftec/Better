import React, { useState } from "react";
import { useOAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import CountryPicker from "react-native-country-picker-modal";

const { width, height } = Dimensions.get("window");

const SignUp = () => {
  const navigation = useNavigation();
  const { signUp, isLoaded } = useSignUp();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("1");

  const google = useOAuth({ strategy: "oauth_google" });
  const apple = useOAuth({ strategy: "oauth_apple" });
  const facebook = useOAuth({ strategy: "oauth_facebook" });

  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  const handleOAuth = async (strategy) => {
    try {
      if (strategy === "google") await google.startOAuthFlow();
      else if (strategy === "apple") await apple.startOAuthFlow();
      else if (strategy === "facebook") await facebook.startOAuthFlow();
    } catch (err) {
      console.error(`OAuth error:`, err);
    }
  };

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        // phoneNumber: `+${callingCode}${mobile}`,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Success", "Check your email to verify your account");
      navigation.navigate("EmailVerificationScreen", { email });
    } catch (err) {
      
      Alert.alert("Error", err.errors?.[0]?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an{"\n"}account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Image
          source={require("../Images/mail.png")}
          style={styles.iconRight}
        />
      </View>

      <View style={styles.inputContainer}>
        <CountryPicker
          countryCode={countryCode}
          withCallingCode
          withFilter
          withFlag
          withCallingCodeButton
          onSelect={onSelect}
          containerButtonStyle={{ marginRight: 10 }}
        />
        
        <TextInput
          style={styles.input}
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
          <Image
            source={
              showPassword
                ? require("../Images/eye-on.png")
                : require("../Images/eye-off.png")
            }
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Image
            source={
              showConfirmPassword
                ? require("../Images/eye-on.png")
                : require("../Images/eye-off.png")
            }
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        By creating an account, you agree to our{" "}
        <Text style={styles.link}>Terms of Service</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.or}>- OR Continue with -</Text>

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

      <TouchableOpacity
        style={styles.login}
        onPress={() => navigation.navigate("SignIn")}
      >
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
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 60,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  iconRight: {
    width: 20,
    height: 20,
    tintColor: "#888",
  },
  terms: {
    fontSize: 12,
    color: "#444",
    marginBottom: 16,
  },
  link: {
    color: "#0056D2",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2D82DB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  or: {
    textAlign: "center",
    marginBottom: 5,
    color: "#666",
  },
  socials: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 16,
  },
  socialIcon: {
    width: 40,
    height: 35,
    resizeMode: "contain",
  },
  login: {
    alignItems: "center",
  },
  loginText: {
    color: "#333",
  },
});

export default SignUp;
