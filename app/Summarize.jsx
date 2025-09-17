import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  query,
  where,
  setDoc,
  getDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { useUser } from "@clerk/clerk-expo";
import BottomNavigation from "./BottomNavigation";

const { width, height } = Dimensions.get("window");

const Summarize = () => {
  const navigation = useNavigation();
  const { videoId } = useLocalSearchParams();
  const { user } = useUser();

  const [summary, setSummary] = useState("");
  const [takeaways, setTakeaways] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  const [modalVisible, setModalVisible] = useState(false);
  const [showExisting, setShowExisting] = useState(false);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchOrLoadSummary = async () => {
      if (!videoId || !user) return;

      try {
        const summaryRef = doc(db, "videoSummaries", videoId);
        const docSnap = await getDoc(summaryRef);

        if (docSnap.exists()) {
          // ✅ Load cached summary
          const data = docSnap.data();
          setSummary(data.summary);
          setTakeaways(data.takeaways);
          console.log("Loaded summary from Firestore");
        } else {
          // ⏳ Generate new summary
          const transcriptRes = await axios.post(
            "http://192.168.1.7:5000/api/transcript",
            { videoUrl: `https://www.youtube.com/watch?v=${videoId}` }
          );

          const transcript = transcriptRes.data.transcript;

          const summaryRes = await axios.post(
            "http://192.168.1.7:5000/api/summarize",
            { transcript }
          );

          const newSummary = summaryRes.data.summary;
          const newTakeaways = summaryRes.data.keyTakeaways;

          setSummary(newSummary);
          setTakeaways(newTakeaways);

          // 💾 Save summary for this video
          await setDoc(summaryRef, {
            summary: newSummary,
            takeaways: newTakeaways,
            userId: user.id,
            createdAt: serverTimestamp(),
          });

          console.log("Saved summary to Firestore");
        }

        // ✅ Track user's completion
        await trackUserCompletion(videoId, user.id);

      } catch (error) {
        console.error("Error in fetching or saving summary:", error);
      }
    };

    fetchOrLoadSummary();
  }, [videoId, user]);

  // 🔥 Track per-user completion
  const trackUserCompletion = async (videoId, userId) => {
    try {
      const completionRef = doc(
        db,
        "users",
        userId,
        "completedSummaries",
        videoId
      );
      const completionSnap = await getDoc(completionRef);

      if (!completionSnap.exists()) {
        // Mark as completed
        await setDoc(completionRef, { completedAt: serverTimestamp() });

        // Increment user's counter
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          summaryCount: increment(1),
        });

        console.log("✅ User summaryCount incremented");
      } else {
        console.log("ℹ️ User already completed this summary, no increment");
      }
    } catch (error) {
      console.error("Error updating user summary count:", error);
    }
  };

  const playAudio = async () => {
    if (!audioUrl) return;
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    await sound.playAsync();
  };

  const fetchLists = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const listsQuery = query(
        collection(db, "summaryLists"),
        where("isPublic", "==", true)
      );
      const privateListsQuery = query(
        collection(db, "summaryLists"),
        where("isPublic", "==", false),
        where("ownerId", "==", user.id)
      );

      const [publicSnapshot, privateSnapshot] = await Promise.all([
        getDocs(listsQuery),
        getDocs(privateListsQuery),
      ]);

      const fetchedLists = [];
      publicSnapshot.forEach((doc) => {
        fetchedLists.push({ id: doc.id, ...doc.data() });
      });
      privateSnapshot.forEach((doc) => {
        fetchedLists.push({ id: doc.id, ...doc.data() });
      });

      setLists(fetchedLists);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const addToList = async (listId) => {
    try {
      const listRef = doc(db, "summaryLists", listId);
      await updateDoc(listRef, {
        videos: arrayUnion(videoId),
      });
      Alert.alert("Success", "Video added to the list!");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

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

      {/* Video */}
      <YoutubePlayer height={200} play={false} videoId={videoId} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Summary Title</Text>

        <View style={styles.row}>
          <Text>❤️ 24</Text>
          <TouchableOpacity onPress={playAudio}>
            <Text style={styles.audio}>🎧 34</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.audioLabel}>Audio Summary</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={{ fontSize: 15, marginLeft: 8 }}>➕</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segment,
              activeTab === "summary" && styles.activeSegment,
            ]}
            onPress={() => setActiveTab("summary")}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "summary" && styles.activeSegmentText,
              ]}
            >
              Detailed Summary
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segment,
              activeTab === "takeaways" && styles.activeSegment,
            ]}
            onPress={() => setActiveTab("takeaways")}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === "takeaways" && styles.activeSegmentText,
              ]}
            >
              Key Takeaways
            </Text>
          </TouchableOpacity>
        </View>





        <View style={{ flex: 1, marginTop: 10 }}>
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 10 }}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {activeTab === "summary" ? (
              <>
                <Text style={styles.sectionTitle}>Understanding Management</Text>
                <Text style={styles.description}>
                  {summary || "Loading summary..."}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Key Takeaways</Text>
                {takeaways && takeaways.length > 0 ? (
                  takeaways.map((item, index) => (
                    <View key={index} style={{ marginBottom: 12 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          marginBottom: 4,
                        }}
                      >
                        {index + 1}. {item.heading}
                      </Text>
                      <Text style={{ fontSize: 14, lineHeight: 20 }}>
                        {item.content}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text>Loading key takeaways...</Text>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            {!showExisting ? (
              <>
                <Text style={styles.modalTitle}>Add to:</Text>
                <TouchableOpacity
                  onPress={async () => {
                    await fetchLists();
                    setShowExisting(true);
                  }}
                  style={[styles.btn, { backgroundColor: "#2D82DB" }]}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Existing List
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("CreateListScreen", { videoId });
                  }}
                  style={[styles.btn, { backgroundColor: "#2D82DB" }]}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Create New List
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Select a list:</Text>
                <FlatList
                  data={lists}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.btn, { backgroundColor: "#2D82DB" }]}
                      onPress={() => addToList(item.id)}
                    >
                      <Text style={{ color: "white", textAlign: "center" }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowExisting(false)}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ fontWeight: "800", fontSize: 20 }}>←</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => {
                setModalVisible(false);
                setShowExisting(false);
              }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 50, flex: 1 },
  header: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: { marginLeft: 12, fontSize: 16, fontWeight: "600", flex: 1 },
  headerIcons: { flexDirection: "row", gap: 8, marginLeft: "auto" },
  content: { marginHorizontal: 16, flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  audio: { fontSize: 18 },
  audioLabel: { fontSize: 12, color: "#555" },
  description: { marginTop: 10, fontSize: 15, marginVertical: 4, lineHeight: 22 },
  btn: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalBox: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  closeIcon: { position: "absolute", top: 10, right: 10, zIndex: 10 },
  segmentContainer: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "black", // pill background
    borderRadius: 25,
    padding: 2,
    marginVertical: 12,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  activeSegment: {
    backgroundColor: "#2D82DB",
  },
  segmentText: {
    color: "white",
    fontWeight: "600",
  },
  activeSegmentText: {
    color: "#fff",
    fontWeight: "700",
  },


  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
});

export default Summarize;
