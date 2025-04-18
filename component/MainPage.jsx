import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useNavigation } from 'expo-router';
import axios from 'axios';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const API_KEY = 'AIzaSyA3pmJmKVoZavaCfbJ3gUM9XxEDyLbG5b0';
const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Replace with your desired channel ID

const MainPage = () => {
  const [videos, setVideos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`
        );
        setVideos(res.data.items);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideos();
  }, []);

  const renderVideoCard = ({ item }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => navigation.navigate('Summarize', { videoId: item.id.videoId })}
    >
      <Image source={{ uri: item.snippet.thumbnails.medium.url }} style={styles.thumbnail} />
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
          key={item.id.videoId}
          style={styles.carouselSlide}
          onPress={() => navigation.navigate('Summarize', { videoId: item.id.videoId })}
        >
          <Image source={{ uri: item.snippet.thumbnails.high.url }} style={styles.carouselImage} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Ionicons name="search" size={20} color="#aaa" style={{ marginLeft: 8 }} />
          <TextInput placeholder="Search" style={styles.searchInput} />
          <TouchableOpacity>
            <Feather name="bell" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="menu" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        <Carousel videos={videos} />

        {/* Trending Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={videos.slice(5)}
          renderItem={renderVideoCard}
          keyExtractor={(item) => item.id.videoId}
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
          data={videos.slice(0, 5)}
          renderItem={renderVideoCard}
          keyExtractor={(item) => item.id.videoId + '_pop'}
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

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={24} color="#007BFF" />
        <Text style={styles.navLabel}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Library')}>
        <Ionicons name="library-outline" size={24} color="#999" />
        <Text style={styles.navLabel}>Library</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Summarize')}>
        <Ionicons name="document-text-outline" size={24} color="#999" />
        <Text style={styles.navLabel}>Summarize</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={24} color="#999" />
        <Text style={styles.navLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#000',
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
    width: '100%',
    height: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeMore: {
    fontSize: 14,
    color: '#007BFF',
  },
  videoCard: {
    width: 160,
    marginHorizontal: 8,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    padding: 8,
  },
  thumbnail: {
    width: '100%',
    height: 90,
    borderRadius: 8,
  },
  title: {
    marginTop: 6,
    fontWeight: '500',
    fontSize: 13,
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
  },
  navLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: '#999',
    marginTop: 2,
  },
});

export default MainPage;
