import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";


const { width } = Dimensions.get("window");

const PersonalInformation = () => {
  const navigation = useNavigation();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");

  useEffect(() => {
    if (isLoaded && user) {
      const meta = user.publicMetadata || {};
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setGender(meta.gender || "");
      setBirthday(meta.birthday || "");
    }
  }, [isLoaded]);

  const handleSubmit = async () => {
    try {
      navigation.navigate("InterestArea", {
        firstName,
        lastName,
        gender,
        birthday,
      });
  
      
    } catch (err) {
      console.log("Error updating profile:", err);
    }
  };
  
  
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Tell us more about yourself</Text>
      <Text style={styles.subtitle}>
        Please enter your details. This information will be used to personalize
        your account.
      </Text>

      <Text style={styles.label}>First name</Text>
      <TextInput
        style={styles.input}
        placeholder="John"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last name</Text>
      <TextInput
        style={styles.input}
        placeholder="Wick"
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Date of birth</Text>
      <TextInput
        style={styles.input}
        placeholder="MM/DD/YYYY"
        value={birthday}
        onChangeText={setBirthday}
      />

      <Text style={styles.label}>Select your gender</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderOption,
            gender === "male" && styles.genderSelected,
          ]}
          onPress={() => setGender("male")}
        >
          <Image
            source={require("../Images/male.png")}
            style={styles.genderIcon}
          />
          <Text
            style={[
              styles.genderText,
              gender === "male" && styles.genderTextSelected,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderOption,
            gender === "female" && styles.genderSelected,
          ]}
          onPress={() => setGender("female")}
        >
          <Image
            source={require("../Images/female.png")}
            style={styles.genderIcon}
          />
          <Text
            style={[
              styles.genderText,
              gender === "female" && styles.genderTextSelected,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleSubmit}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 20,
  },
  backArrow: {
    fontSize: 24,
    color: "#377DFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  genderContainer: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
  },
  genderOption: {
    width: (width - 64) / 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  genderSelected: {
    borderColor: "#377DFF",
  },
  genderIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    resizeMode: "contain",
  },
  genderText: {
    fontSize: 16,
    color: "#333",
  },
  genderTextSelected: {
    color: "#377DFF",
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#2D82DB",
    borderRadius: 12,
    marginTop: 32,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
