import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";

import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation,useRoute } from "@react-navigation/native";
const interestData = [
  [
    { label: "Emotional", icon: <Ionicons name="flower-outline" size={20} /> },
    {
      label: "Intellectual",
      icon: <MaterialIcons name="psychology" size={20} />,
    },
  ],
  [{ label: "Health", icon: <FontAwesome5 name="heartbeat" size={20} /> }],
  [
    {
      label: "Spiritual",
      icon: <MaterialIcons name="self-improvement" size={20} />,
    },
    { label: "Career", icon: <Ionicons name="briefcase-outline" size={20} /> },
  ],
  [
    {
      label: "Lifestyle & Wellness",
      icon: <Ionicons name="fitness-outline" size={20} />,
    },
  ],
  [
    {
      label: "Financial",
      icon: <FontAwesome5 name="hand-holding-usd" size={20} />,
    },
    { label: "Social", icon: <Ionicons name="people-outline" size={20} /> },
  ],
  [
    {
      label: "Entrepreneurship",
      icon: <Ionicons name="business-outline" size={20} />,
    },
  ],
];


const InterestArea = ({route}) => {
  const {params} = useRoute();
  const navigation = useNavigation();
  const { firstName, lastName, gender, birthday } = params || {};
  const { user } = useUser();
  const [selected, setSelected] = useState([]);

  const toggleSelection = (label) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

 const handleContinue = () => {
  navigation.navigate("GoalSetup", {
    firstName,
    lastName,
    gender,
    birthday,
    interests: selected,
  });
};

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interest Areas</Text>
      <Text style={styles.subtitle}>Select the areas of your interest</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {interestData.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.row,
              row.length === 1 ? styles.fullWidthRow : styles.halfRow,
            ]}
          >
            {row.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.button,
                  selected.includes(item.label) && styles.selectedButton,
                  row.length === 1 ? styles.fullButton : styles.halfButton,
                ]}
                onPress={() => toggleSelection(item.label)}
              >
                <View style={styles.iconWrapper}>{item.icon}</View>
                <Text
                  style={[
                    styles.buttonText,
                    selected.includes(item.label) && styles.selectedText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InterestArea;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 10,
  },
  scrollContainer: {
    paddingBottom: 0,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  fullWidthRow: {
    justifyContent: "center",
  },
  halfRow: {
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 4,
  },
  halfButton: {
    width: "47%",
  },
  fullButton: {
    width: "100%",
  },
  selectedButton: {
    backgroundColor: "#e0f0ff",
    borderColor: "#2D82DB",
  },
  iconWrapper: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedText: {
    color: "#2D82DB",
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#2D82DB",
    width: 340,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 30,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
