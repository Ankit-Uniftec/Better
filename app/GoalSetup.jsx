import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";

const { width, height } = Dimensions.get("window");
const GoalSetup = () => {
   const navigation = useNavigation();
  const { user } = useUser();
  const route = useRoute();
  const { firstName, lastName, gender, birthday, interests } = route.params || {};

  const [frequency, setFrequency] = useState("Daily");
  const [count, setCount] = useState(5);
  const [category, setCategory] = useState("");

  const frequencies = ["Daily", "Weekly", "Monthly"];

  const handleCountChange = (type) => {
    if (type === "decrement" && count > 0) setCount(count - 1);
    if (type === "increment") setCount(count + 1);
  };

  const handleContinue=async ()=>{
    try{
      await user.update({
        unsafeMetadata:{
          firstName,
          lastName,
          gender,
          birthday,
          interests,
          goalFrequency: frequency,
          goalCount: count,
          goalCategory: category
        },
      });
      navigation.navigate("MainPage");
    }
    catch(err){
      console.error("Error saving data:", err);
    }

  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set your goals</Text>
      <Text style={styles.subtitle}>
        Create your daily, weekly, monthly goals
      </Text>

      <Text style={styles.label}>Goal Frequency</Text>
      <View style={styles.frequencyContainer}>
        {frequencies.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFrequency(item)}
            style={[
              styles.freqButton,
              frequency === item && styles.freqButtonActive,
            ]}
          >
            <Text
              style={[
                styles.freqButtonText,
                frequency === item && styles.freqButtonTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>
        How many summaries do you want to read{" "}
        <Text style={styles.linkText}>{frequency.toLowerCase()}</Text>?
      </Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => handleCountChange("decrement")}
        >
          <Text style={styles.counterText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.countValue}>{count}</Text>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => handleCountChange("increment")}
        >
          <Text style={styles.counterText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        Select a specific category for this goal{" "}
        <Text style={styles.optionalText}>(Optional)</Text>
      </Text>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
        >
          <Picker.Item label="Dropdown displaying category name" value="" />
          <Picker.Item label="Productivity" value="productivity" />
          <Picker.Item label="Health" value="health" />
          <Picker.Item label="Finance" value="finance" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.addGoalButton}>
        <Text style={styles.addGoalButtonText}>Add more goals</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 80,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "500",
  },
  frequencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 4,
  },
  freqButton: {
    flex: 1,
    paddingVertical: 10,

    borderRadius: 12,
    alignItems: "center",
  },
  freqButtonActive: {
    backgroundColor: "#2D82DB",
  },
  freqButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  freqButtonTextActive: {
    color: "#fff",
  },
  linkText: {
    color: "#3498db",
    fontWeight: "500",
  },
  optionalText: {
    color: "#888",
    fontStyle: "italic",
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
    alignItems: "center",
  },
  counterButton: {
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    height: 37,
    width: 73,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },
  counterText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 37,
  },
  countValue: {
    width: 170,
    height: 37,
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "#EFEFEF",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 37,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 12,
  },
  addGoalButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 1,
    alignItems: "center",
    marginVertical: 12,

    borderRadius: 16,
  },
  addGoalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: "#2D82DB",
    paddingVertical: 16,
    borderRadius: 16,
    height: 55,
    alignItems: "center",
    marginTop: "auto",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default GoalSetup;
