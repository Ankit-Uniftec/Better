import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const Settings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
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

      <View style={styles.profileContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require("../Images/avtar.jpg")}
            style={styles.avatar}
          />
          <View style={styles.editIcon}>
            <Ionicons name="create-outline" size={14} color="#fff" />
          </View>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.username}>@johndoe</Text>
      </View>

      <View style={styles.menu}>
        {[
          "Notifications",
          "Language",
          "Privacy Policy",
          "Terms of Use",
          "Disclaimer",
        ].map((item) => (
          <TouchableOpacity key={item} style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.supportButton}>
        <Text style={styles.supportButtonText}>Contact Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
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

      <TouchableOpacity onPress={() => navigation.navigate("Summarize")}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color={getIconColor("Summarize")}
        />
        <Text style={[styles.navLabel, { color: getIconColor("Summarize") }]}>
          Summarize
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
    marginLeft: "auto",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    resizeMode: "contain",
  },
  editIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#2D82DB",
    borderRadius: 12,
    padding: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  username: {
    fontSize: 14,
    color: "#888",
  },
  menu: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginVertical: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: {
    fontSize: 16,
  },
  supportButton: {
    backgroundColor: "#2D82DB",
    height: 47,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  supportButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    height: 47,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomNav: {
    marginTop: height * 0.07,

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

export default Settings;
