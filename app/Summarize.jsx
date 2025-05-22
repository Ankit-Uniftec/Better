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
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { useUser } from "@clerk/clerk-expo";
import { ScrollView } from "react-native";
import { setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const Summarize = () => {
  const navigation = useNavigation();
  const { videoId } = useLocalSearchParams();
  const [summary, setSummary] = useState("");
  const [takeaways, setTakeaways] = useState("");
  const [detailed, setDetailed] = useState("");
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
          // ✅ Use cached data
          const data = docSnap.data();
          setSummary(data.summary);
          setTakeaways(data.takeaways);
          console.log("Loaded summary from Firestore");
        } else {
          // ⏳ Generate new summary
          const transcriptRes = await axios.post(
            "http://192.168.1.3:5000/api/transcript",
            {
              videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
            }
          );

          const transcript = transcriptRes.data.transcript;

          const summaryRes = await axios.post(
            "http://192.168.1.3:5000/api/summarize",
            {
              transcript,
            }
          );

          const newSummary = summaryRes.data.summary;
          const newTakeaways = summaryRes.data.keyTakeaways;

          setSummary(newSummary);
          setTakeaways(newTakeaways);

          // 💾 Save to Firestore
          await setDoc(summaryRef, {
            summary: newSummary,
            takeaways: newTakeaways,
            userId: user.id,
            createdAt: serverTimestamp(),
          });

          console.log("Saved summary to Firestore");
        }
      } catch (error) {
        console.error("Error in fetching or saving summary:", error);
      }
    };

    fetchOrLoadSummary();
  }, [videoId, user]);

  const playAudio = async () => {
    if (!audioUrl) return;
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
    await sound.playAsync();
  };

  const { user } = useUser();

  const fetchLists = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "User not authenticated");
        return;
      }
      // Fetch public lists or private lists owned by current user
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

      <YoutubePlayer height={200} play={false} videoId={videoId} />

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

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "summary" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("summary")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "summary" && styles.activeTabText,
              ]}
            >
              Detailed Summary
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "takeaways" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("takeaways")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "takeaways" && styles.activeTabText,
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
                <Text style={styles.sectionTitle}>
                  Understanding Management
                </Text>
                <Text style={styles.description}>
                  {summary || "Loading summary..."}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Key Takeaways</Text>
                <Text style={styles.description}>
                  {takeaways || "Loading key takeaways..."}
                </Text>
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
                  <Text style={{ fontWeight: 800, fontSize: 20 }}>←</Text>
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

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const getIconColor = (screenName) =>
    route.name === screenName ? "#007BFF" : "#999";

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

  description: {
    marginTop: 10,
    fontSize: 14,

    fontSize: 15,
    marginVertical: 4,
    lineHeight: 22,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 10,
    flexGrow: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  buttonGroup: { flexDirection: "column", marginTop: 10, gap: 10 },
  btn: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  feedbackBox: {
    marginTop: 20,
    backgroundColor: "#cce5ff",
    padding: 15,
    borderRadius: 10,
  },
  feedbackText: { fontWeight: "600", marginBottom: 10 },
  feedbackButtons: { flexDirection: "row", justifyContent: "space-between" },
  thumbBtn: { padding: 10, backgroundColor: "#fff", borderRadius: 6 },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e6e6e6",
    zIndex: 10, // ensure it stays above other elements
  },

  navLabel: {
    fontSize: 10,
    textAlign: "center",
    color: "#999",
    marginTop: 2,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  tabContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 12,
    marginTop: 12,
  },

  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#333",
    marginHorizontal: 4,
  },

  activeTab: {
    backgroundColor: "#2D82DB",
  },

  tabText: {
    color: "#fff",
    fontWeight: "bold",
  },

  activeTabText: {
    color: "#fff",
  },

  tabContent: {
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});

export default Summarize;
