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
import axios from "axios";
import BottomNavigation from './BottomNavigation';
const { width, height } = Dimensions.get("window");

const MainPage = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const navigation = useNavigation();

  // Fetch video title using the YouTube API
  const getVideoTitle = async (videoId) => {
    const apiKey = "AIzaSyA3pmJmKVoZavaCfbJ3gUM9XxEDyLbG5b0"; // Replace with your YouTube API key
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.items.length > 0) {
        return response.data.items[0].snippet.title;
      }
    } catch (error) {
      console.error("Error fetching video title:", error);
    }
    return videoId; // Fallback to videoId if title is not found
  };

  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const trendingVideos = [];
      const popularVideos = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const videoId = extractVideoId(data.videoUrl);
        if (videoId && data.category) {
          const title = await getVideoTitle(videoId); // Fetch the title dynamically

          const video = {
            id: doc.id,
            videoId,
            snippet: {
              title: title || videoId, // Use videoId if title is not found
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
      }

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
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={2}>
        {item.snippet.title}
      </Text>
    </TouchableOpacity>
  );

  const CarouselComponent = ({ videos }) => (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.carouselWrapper}
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
            resizeMode="cover"
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#aaa"
              style={{ marginLeft: 8 }}
            />
            <TextInput placeholder="Search" style={styles.searchInput} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Feather name="bell" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
            <Feather name="menu" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        <CarouselComponent videos={trending} />

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



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginBottom: 10,
    height: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,

    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    paddingLeft: 10,
    height: 40,
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
  carouselWrapper: {
    height: height * 0.25,
    marginBottom: 20,
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
    height: 100,
    borderRadius: 8,
  },
  title: {
    marginTop: 6,
    fontWeight: "500",
    fontSize: 13,
    color: "#000",
  },
  
});

export default MainPage;
