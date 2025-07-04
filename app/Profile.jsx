import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomNavigation from './BottomNavigation';
const Profile = () => {
  const dailyGoalsData = [4, 7, 7, 3, 2, 7, 0]; // S to S
  const completedDays = 3;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("MainPage")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Summarize</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons name="notifications-outline" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <View style={styles.profileText}>
          <Text style={styles.name}>John Wick</Text>
          <Text style={styles.joinDate}>joined 15-06-2024</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.subHeading}>This Week’s progress</Text>
        <Text style={styles.goalStatus}>
          You’ve completed <Text style={styles.highlight}>{completedDays}</Text> out of 7 daily goals.
        </Text>

        <BarChart
          style={styles.chart}
          data={dailyGoalsData}
          svg={{ fill: '#007BFF' }}
          spacingInner={0.4}
          contentInset={{ top: 10, bottom: 10 }}
          gridMin={0}
          yMax={7}
        >
          <Grid />
        </BarChart>

        <View style={styles.dayLabels}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <Text key={i} style={styles.dayText}>{d}</Text>
          ))}
        </View>
      </View>

      {/* Goals */}
      <View style={styles.goalsSection}>
        <Text style={styles.subHeading}>Your Goals</Text>
        <View style={styles.goalItem}>
          <Text style={styles.goalText}>🔥 5 summaries</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Daily</Text>
          </View>
        </View>
        <View style={styles.goalItem}>
          <Text style={styles.goalText}>🔥 5 summaries</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Weekly</Text>
          </View>
        </View>
      </View>
      <BottomNavigation />
    </View>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: { marginLeft: 12, fontSize: 16, fontWeight: "600", flex: 1 },
  headerIcons: { flexDirection: "row", gap: 8, marginLeft: "auto" },
  icon: { marginRight: 8 },
  profileSection: {
    flexDirection: 'row', alignItems: 'center', marginVertical: 20, marginHorizontal: 16,
  },
  profileImage: {
    width: 60, height: 60, borderRadius: 30
  },
  profileText: { marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  joinDate: { color: '#666' },
  editButton: {
    marginLeft: 'auto', backgroundColor: '#007BFF',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20
  },
  editText: { color: '#fff', fontWeight: '500' },
  progressSection: { marginVertical: 20, marginHorizontal: 16 },
  subHeading: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  goalStatus: { marginBottom: 12 },
  highlight: { color: '#007BFF', fontWeight: 'bold' },
  chart: { height: 120 },
  dayLabels: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 8, marginTop: 6
  },
  dayText: { color: '#333' },
  goalsSection: { marginTop: 30, marginHorizontal: 16 },
  goalItem: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 12
  },
  goalText: { fontSize: 16 },
  badge: {
    backgroundColor: '#333', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4
  },
  badgeText: { color: '#fff', fontSize: 12 },

});

export default Profile;
