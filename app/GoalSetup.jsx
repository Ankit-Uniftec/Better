import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const GoalSetup = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const route = useRoute();
  const { firstName, lastName, gender, birthday, interests } =
    route.params || {};

  // list of all goals
  const [goals, setGoals] = useState([]);

  // single goal input
  const [frequency, setFrequency] = useState("Daily");
  const [count, setCount] = useState(5);
  const [category, setCategory] = useState("");

  const frequencies = ["Daily", "Weekly", "Monthly"];

  const handleCountChange = (type) => {
    if (type === "decrement" && count > 0) setCount(count - 1);
    if (type === "increment") setCount(count + 1);
  };

  // add current goal to list
  const handleAddGoal = () => {
    if (!frequency || !count) return;

    const newGoal = {
      frequency,
      count,
      category,
    };

    setGoals([...goals, newGoal]);

    // reset input
    setFrequency("Daily");
    setCount(5);
    setCategory("");
  };

  // save all goals + user info
  const handleContinue = async () => {
    const userData = {
      firstName,
      lastName,
      gender,
      birthday,
      interests,
      goals, // ✅ save array of goals instead of one
    };

    try {
      await user.update({ unsafeMetadata: userData });
      const userRef = doc(db, "users", user.id);
      await setDoc(userRef, userData, { merge: true });

      navigation.navigate("MainPage");
    } catch (err) {
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

      <TouchableOpacity style={styles.addGoalButton} onPress={handleAddGoal}>
        <Text style={styles.addGoalButtonText}>Add more goals</Text>
      </TouchableOpacity>

      {/* ✅ Display added goals */}
      {goals.length > 0 && (
        <FlatList
          data={goals}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.goalItem}>
              <Text style={styles.goalText}>
                {index + 1}. {item.frequency} - {item.count} summaries{" "}
                {item.category ? `(${item.category})` : ""}
              </Text>
            </View>
          )}
        />
      )}

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
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 12,
  },
  addGoalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  goalItem: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  goalText: {
    fontSize: 14,
    fontWeight: "500",
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
