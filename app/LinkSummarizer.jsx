import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
const LinkSummarizer = () => {
  const [url, setUrl] = useState("");
  const navigation = useNavigation();

  const handleSummarize = () => {
    if (!url.trim()) {
      Alert.alert("Please paste a YouTube URL");
      return;
    }

    Alert.alert("Summary generated!", `URL: ${url}`);
    setUrl("");
  };

  const handleHelpLink = () => {
    Alert.alert(
      "How to get the link?",
      'Go to the YouTube app, open a video, tap "Share" and choose "Copy Link".'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summarize</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            {" "}
            <Ionicons name="menu-outline" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.logoContainer}>
        <Image
          source={require("../Images/logoBlue.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome to Better</Text>
        <Text style={styles.titleHighlight}>Summarize</Text>
      </View>

      <TextInput
        placeholder="Paste YouTube URL"
        placeholderTextColor="#888"
        value={url}
        onChangeText={setUrl}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSummarize}>
        <Text style={styles.buttonText}>Summarize</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleHelpLink}>
        <Text style={styles.helpText}>How to get the link?</Text>
      </TouchableOpacity>

      <BottomNavigation />
    </View>
  );
};

const BottomNavigation = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={24} color="#007BFF" />
        <Text style={styles.navLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Library")}>
        <Ionicons name="library-outline" size={24} color="#999" />
        <Text style={styles.navLabel}>Library</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Summarize")}>
        <Ionicons name="document-text-outline" size={24} color="#999" />
        <Text style={styles.navLabel}>Summarize</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Ionicons name="person-outline" size={24} color="#999" />
        <Text style={styles.navLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LinkSummarizer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 30,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
    marginLeft: "auto",
  },
  icon: {
    marginRight: "auto",
  },
  logoContainer: {
    marginTop: 50,
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 60,
    height: 60,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: "#000",
  },
  titleHighlight: {
    color: "#2D82DB",
    fontWeight: "700",
    fontSize: 28,
  },
  input: {
    backgroundColor: "#F8F9FE",
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#2D82DB",
    borderRadius: 16,
    paddingVertical: 16,

    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  helpText: {
    textAlign: "center",
    fontSize: 14,
    color: "#444",
    textDecorationLine: "underline",
  },
  bottomNav: {
    marginTop: height * 0.15,

    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  navLabel: {
    fontSize: 10,
    textAlign: "center",
    color: "#999",
    marginTop: 2,
  },
});
