import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useUser, useAuth } from "@clerk/clerk-expo"; // ✅ Added useAuth

const SignOut = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { signOut } = useAuth(); // ✅ Get signOut method

  const handleSignOut = async () => {
    try {
      await signOut(); // ✅ Correct sign-out call
      navigation.navigate("SignIn"); // ✅ Navigate after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity>
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
            <Ionicons name="menu-outline" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require("../Images/avtar.jpg")}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.username}>@johndoe</Text>
      </View>

      {/* Logout Box */}
      <View style={styles.logoutCard}>
        <Image
          source={require("../Images/Signout.png")}
        />
        <Text style={styles.logoutTitle}>Sign out</Text>
        <Text style={styles.logoutText}>Are you sure you want to log out?</Text>

        <TouchableOpacity style={styles.noButton} onPress={() => navigation.navigate("Setting")}>
          <Text style={styles.noButtonText}>No</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.yesButton} onPress={handleSignOut}>
          <Text style={styles.yesButtonText}>Yes</Text>
        </TouchableOpacity>
      </View>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ddd",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2D82DB",
    padding: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    color: "#888",
    fontSize: 14,
  },
  logoutCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 10,
    elevation: 10,
  },
  logoutTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 32,
    textAlign: "center",
  },
  noButton: {
    backgroundColor: "#2D82DB",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
    alignItems: "center",
    height: 47,
  },
  noButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  yesButton: {
    backgroundColor: "#000",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    height: 47,
  },
  yesButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default SignOut;
