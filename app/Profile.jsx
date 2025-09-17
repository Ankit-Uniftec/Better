import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BarChart, Grid } from "react-native-svg-charts";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "./BottomNavigation";
import { useUser } from "@clerk/clerk-expo";
import { db } from "./firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const Profile = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  const [firestoreData, setFirestoreData] = useState(null);
  const [summariesByDay, setSummariesByDay] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // 🔹 Fetch profile data
        const ref = doc(db, "users", user.id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setFirestoreData(snap.data());
        }

        // 🔹 Fetch user's completed summaries
        const q = query(
          collection(db, "videoSummaries"),
          where("userId", "==", user.id)
        );
        const querySnap = await getDocs(q);

        // Count summaries per day of week (0=Sun .. 6=Sat)
        const counts = [0, 0, 0, 0, 0, 0, 0];
        querySnap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.createdAt?.toDate) {
            const day = data.createdAt.toDate().getDay();
            counts[day] += 1;
          }
        });

        setSummariesByDay(counts);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserData();
  }, [user]);

  // Clerk + Firestore fields
  const name = `${user?.firstName || firestoreData?.firstName || "User"} ${
    user?.lastName || firestoreData?.lastName || ""
  }`.trim();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "N/A";

  // Goal data
  const goalCount = firestoreData?.goalCount || 0;
  const goalFrequency = firestoreData?.goalFrequency || "Not set";
  const goalCategory = firestoreData?.goalCategory || "General";

  // ✅ Calculate daily goals completed
  const completedGoals = summariesByDay.filter(
    (count) => count >= goalCount && goalCount > 0
  ).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
          <Ionicons name="arrow-back" size={24} color="#2D82DB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summarize</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons name="notifications-outline" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={26} color="#2D82DB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.imageUrl || "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <View style={styles.profileText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.joinDate}>Joined {joinedDate}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.subHeading}>This Week’s Progress</Text>
        <Text style={styles.goalStatus}>
          You’ve completed{" "}
          <Text style={styles.highlight}>{completedGoals}</Text> out of 7 daily
          goals.
        </Text>

        <BarChart
          style={styles.chart}
          data={summariesByDay}
          svg={{ fill: "#2D82DB" }}
          spacingInner={0.4}
          contentInset={{ top: 10, bottom: 10 }}
          gridMin={0}
        >
          <Grid />
        </BarChart>

        <View style={styles.dayLabels}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <Text key={i} style={styles.dayText}>
              {d}
            </Text>
          ))}
        </View>
      </View>

      {/* Goals */}
      <View style={styles.goalsSection}>
        <Text style={styles.subHeading}>Your Goals</Text>
        <View style={styles.goalItem}>
          <Text style={styles.goalText}>
            🔥 {goalCount} summaries ({goalCategory})
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{goalFrequency}</Text>
          </View>
        </View>
      </View>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: { marginLeft: 12, fontSize: 16, fontWeight: "600", flex: 1 },
  headerIcons: { flexDirection: "row", gap: 8, marginLeft: "auto" },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 16,
  },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  profileText: { marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "600" },
  joinDate: { color: "#666" },
  editButton: {
    marginLeft: "auto",
    backgroundColor: "#2D82DB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: { color: "#fff", fontWeight: "500" },
  progressSection: { marginVertical: 20, marginHorizontal: 16 },
  subHeading: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  goalStatus: { marginBottom: 12 },
  highlight: { color: "#2D82DB", fontWeight: "bold" },
  chart: { height: 120 },
  dayLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8,
    marginTop: 6,
  },
  dayText: { color: "#333" },
  goalsSection: { marginTop: 30, marginHorizontal: 16 },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  goalText: { fontSize: 16 },
  badge: {
    backgroundColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { color: "#fff", fontSize: 12 },
});

export default Profile;
