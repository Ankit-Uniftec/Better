import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { BarChart, YAxis, Grid } from "react-native-svg-charts";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BottomNavigation from "./BottomNavigation";
import { useUser } from "@clerk/clerk-expo";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Rect } from "react-native-svg";
import { max } from "d3-array";

const Profile = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  const [firestoreData, setFirestoreData] = useState(null);
  const [summariesByDay, setSummariesByDay] = useState([0, 0, 0, 0, 0, 0, 0]);
  const currentDay = new Date().getDay(); // 0 = Sunday, 6 = Saturday

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setFirestoreData(data);

          // Set total summaryCount to today's bar
          const counts = [0, 0, 0, 0, 0, 0, 0];
          counts[currentDay] = data.summaryCount || 0;
          setSummariesByDay(counts);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserData();
  }, [user]);

  const name = `${user?.firstName || firestoreData?.firstName || "User"} ${
    user?.lastName || firestoreData?.lastName || ""
  }`.trim();

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "N/A";

  const goals = firestoreData?.goals || [];

  // Determine max for Y-axis scaling
  const maxCount = Math.max(...summariesByDay, 1); // at least 1 to avoid zero scale

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
          <Ionicons name="arrow-back" size={24} color="#2D82DB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Profile</Text>
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
          <Text style={styles.highlight}>
            {summariesByDay.reduce((a, b) => a + b, 0)}
          </Text>{" "}
          summaries this week.
        </Text>

        {/* Bar Chart with YAxis */}
        <View style={{ flexDirection: "row", height: 150, marginHorizontal: 16 }}>
  <YAxis
    data={[0,1,2,3,4,5,6,7,8,9,10]} // fixed Y-axis labels
    contentInset={{ top: 20, bottom: 20 }}
    numberOfTicks={11} // 0..10
    svg={{ fontSize: 12, fill: "#333" }}
    min={0}
    max={10}
  />
  <BarChart
    style={{ flex: 1, marginLeft: 8 }}
    data={summariesByDay}
    svg={{ fill: "#2D82DB" }}
    spacingInner={0.4}
    contentInset={{ top: 20, bottom: 20 }}
    gridMin={0}
    gridMax={10} // scale bars according to 0-10
    yAccessor={({ item }) => item}
  >
    {({ x, y, width, height, data }) =>
      data.map((value, index) => (
        <Rect
          key={index}
          x={x(index)}
          y={y(value)}
          width={width(0.8)}
          height={height(value)}
          fill={index === currentDay ? "#FFA500" : "#2D82DB"}
        />
      ))
    }
    <Grid />
  </BarChart>
</View>


        {/* Day Labels */}
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

        {goals.length > 0 ? (
          <FlatList
            data={goals}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.goalItem}>
                <Text style={styles.goalText}>
                  🔥 {item.count} summaries{" "}
                  {item.category ? `(${item.category})` : ""}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.frequency}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={{ color: "#666", marginTop: 10 }}>
            No goals set yet.
          </Text>
        )}
      </View>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: { marginHorizontal: 16, flexDirection: "row", alignItems: "center", marginBottom: 30 },
  headerTitle: { marginLeft: 12, fontSize: 16, fontWeight: "600", flex: 1 },
  headerIcons: { flexDirection: "row", gap: 8, marginLeft: "auto" },
  profileSection: { flexDirection: "row", alignItems: "center", marginVertical: 20, marginHorizontal: 16 },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  profileText: { marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "600" },
  joinDate: { color: "#666" },
  editButton: { marginLeft: "auto", backgroundColor: "#2D82DB", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  editText: { color: "#fff", fontWeight: "500" },
  progressSection: { marginVertical: 20, marginHorizontal: 16 },
  subHeading: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  goalStatus: { marginBottom: 12 },
  highlight: { color: "#2D82DB", fontWeight: "bold" },
  dayLabels: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 8, marginTop: 6 },
  dayText: { color: "#333" },
  goalsSection: { marginTop: 30, marginHorizontal: 16 },
  goalItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  goalText: { fontSize: 16 },
  badge: { backgroundColor: "#333", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { color: "#fff", fontSize: 12 },
});

export default Profile;
