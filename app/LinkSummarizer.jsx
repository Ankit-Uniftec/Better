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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const LinkSummarizer = () => {
  const [url, setUrl] = useState("");
  const navigation = useNavigation();

  // Helper function to extract YouTube videoId from URL
  const extractVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSummarize = () => {
    if (!url.trim()) {
      Alert.alert("Please paste a YouTube URL");
      return;
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      Alert.alert(
        "Invalid YouTube URL",
        "Please paste a valid YouTube video link."
      );
      return;
    }

    // Navigate to Summarize page with videoId param
    navigation.navigate("Summarize", { videoId });

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
        <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summarize</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
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
  const route = useRoute();

  const getIconColor = (screenName: string) => {
    return route.name === screenName ? "#007BFF" : "#999";
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
        <Ionicons
          name="home-outline"
          size={24}
          color={getIconColor("MainPage")}
        />
        <Text style={[styles.navLabel, { color: getIconColor("MainPage") }]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("LibraryScreen")}>
        <Ionicons
          name="library-outline"
          size={24}
          color={getIconColor("LibraryScreen")}
        />
        <Text
          style={[styles.navLabel, { color: getIconColor("LibraryScreen") }]}
        >
          Library
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("LinkSummarizer")}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color={getIconColor("LinkSummarizer")}
        />
        <Text
          style={[styles.navLabel, { color: getIconColor("LinkSummarizer") }]}
        >
          Summarizer
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
        <Ionicons
          name="person-outline"
          size={24}
          color={getIconColor("Profile")}
        />
        <Text style={[styles.navLabel, { color: getIconColor("Profile") }]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LinkSummarizer;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop: 50,
    backgroundColor: "#fff",
  },
  header: {
    marginHorizontal: 16,
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
    marginHorizontal: 16,
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
    marginHorizontal: 16,
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
    marginTop: height * 0.237,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e6e6e6",
  },
  navLabel: {
    fontSize: 10,
    textAlign: "center",
    color: "#999",
    marginTop: 2,
  },
});
