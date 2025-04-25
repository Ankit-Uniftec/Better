import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { db } from "./firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const MainPage = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trendingVideos = [];
      const popularVideos = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const videoId = extractVideoId(data.videoUrl);
        if (videoId && data.category) {
          const video = {
            id: doc.id,
            videoId,
            snippet: {
              title: videoId,
              thumbnails: {
                medium: {
                  url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                },
                high: {
                  url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                },
              },
            },
          };

          if (data.category.toLowerCase() === "trending") {
            trendingVideos.push(video);
          } else if (data.category.toLowerCase() === "popular") {
            popularVideos.push(video);
          }
        }
      });

      setTrending(trendingVideos);
      setPopular(popularVideos);
    });

    return () => unsubscribe();
  }, []);

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const renderVideoCard = ({ item }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() =>
        navigation.navigate("Summarize", { videoId: item.videoId })
      }
    >
      <Image
        source={{ uri: item.snippet.thumbnails.medium.url }}
        style={styles.thumbnail}
      />
      <Text style={styles.title} numberOfLines={2}>
        {item.snippet.title}
      </Text>
    </TouchableOpacity>
  );

  const Carousel = ({ videos }) => (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.carouselContainer}
    >
      {videos.slice(0, 5).map((item) => (
        <TouchableOpacity
          key={item.videoId}
          style={styles.carouselSlide}
          onPress={() =>
            navigation.navigate("Summarize", { videoId: item.videoId })
          }
        >
          <Image
            source={{ uri: item.snippet.thumbnails.high.url }}
            style={styles.carouselImage}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Ionicons
            name="search"
            size={20}
            color="#aaa"
            style={{ marginLeft: 8 }}
          />
          <TextInput placeholder="Search" style={styles.searchInput} />
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Feather name="bell" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
            <Feather name="menu" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        <Carousel videos={trending} />

        {/* Trending Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={trending}
          renderItem={renderVideoCard}
          keyExtractor={(item) => item.videoId}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        {/* Popular Videos Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Videos</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={popular}
          renderItem={renderVideoCard}
          keyExtractor={(item) => item.videoId + "_pop"}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </View>
  );
};

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getIconColor = (screenName) => {
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#000",
  },
  icon: {
    marginHorizontal: 8,
  },
  carouselContainer: {
    height: height * 0.2,
  },
  carouselSlide: {
    width: width,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  seeMore: {
    fontSize: 14,
    color: "#007BFF",
  },
  videoCard: {
    width: 160,
    marginHorizontal: 8,
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    padding: 8,
  },
  thumbnail: {
    width: "100%",
    height: 90,
    borderRadius: 8,
  },
  title: {
    marginTop: 6,
    fontWeight: "500",
    fontSize: 13,
    color: "#000",
  },
  bottomNav: {
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

export default MainPage;
