// components/MainPage.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import axios from 'axios';

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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Summarize', { videoId: item.id.videoId })}
    >
      <Image source={{ uri: item.snippet.thumbnails.medium.url }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.snippet.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Trending</Text>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.videoId}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, flex: 1 },
  card: { flex: 1, margin: 5, backgroundColor: '#f0f0f0', borderRadius: 10, padding: 10 },
  thumbnail: { width: '100%', height: 100, borderRadius: 8 },
  title: { marginTop: 8, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});

export default MainPage;
