import React, { useEffect, useState } from 'react';
import CreateListModal from './CreateListModal';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Image
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { db } from './firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, where } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-expo';
import BottomNavigation from './BottomNavigation';

const YOUTUBE_API_KEY = 'AIzaSyA3pmJmKVoZavaCfbJ3gUM9XxEDyLbG5b0';

import { NavigationProp, ParamListBase } from '@react-navigation/native';

const LibraryScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute();

  interface SummaryList {
    id: string;
    name?: string;
    createdAt?: any;
    videos?: string[];
    [key: string]: any;
  }

  interface Video {
    id: string;
    title: string;
    thumbnail: string;
  }

  const [summaryLists, setSummaryLists] = useState<SummaryList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedListName, setSelectedListName] = useState<string>('');
  const [listVideos, setListVideos] = useState<Video[]>([]);

  const { user } = useUser();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadLists();
    });
    return unsubscribe;
  }, [navigation]);

  const loadLists = async () => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      // Fetch public lists or private lists owned by current user
      const publicListsQuery = query(
        collection(db, 'summaryLists'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );
      const privateListsQuery = query(
        collection(db, 'summaryLists'),
        where('isPublic', '==', false),
        where('ownerId', '==', user.id)
      );

      const [publicSnapshot, privateSnapshot] = await Promise.all([
        getDocs(publicListsQuery),
        getDocs(privateListsQuery),
      ]);

      const lists: SummaryList[] = [];
      publicSnapshot.forEach(doc => {
        lists.push({ id: doc.id, ...doc.data() });
      });
      privateSnapshot.forEach(doc => {
        lists.push({ id: doc.id, ...doc.data() });
      });

      setSummaryLists(lists);
    } catch (error) {
      console.error('Failed to load lists:', error);
    }
  };

  const loadVideosForList = async (listId: string, listName: string) => {
    try {
      setSelectedListId(listId);
      setSelectedListName(listName);

      const listRef = doc(db, 'summaryLists', listId);
      const listDoc = await getDoc(listRef);

      if (!listDoc.exists()) {
        console.log('List not found');
        return;
      }

      const listData = listDoc.data();
      const videoIds = listData.videos || [];

      if (videoIds.length === 0) {
        setListVideos([]);
        return;
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();

      const videos = data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
      }));

      setListVideos(videos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const chunked: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const renderListRows = () => {
    const rows = chunkArray(summaryLists, 2);
    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.listRow}>
        {row.map((list) => (
          <TouchableOpacity
            key={list.id}
            style={styles.listButton}
            onPress={() => loadVideosForList(list.id, list.name || '')}
          >
            <Text style={styles.listText}>{list.name}</Text>
          </TouchableOpacity>
        ))}
        {row.length < 2 && <View style={[styles.listButton, { backgroundColor: 'transparent' }]} />}
      </View>
    ));
  };

  const renderVideoCards = () => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {/* {selectedListName ? `Videos in "${selectedListName}"` : "Videos"} */}
            Public Lists-Betterfluencers
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {listVideos.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={styles.horizontalCard}
              onPress={() => navigation.navigate("Summarize", { videoId: video.id })}
            >
              <Image
                source={{ uri: video.thumbnail }}
                style={styles.horizontalCardImage}
              />
              <Text numberOfLines={2} style={styles.cardTitle}>
                {video.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#aaa" style={{ marginLeft: 8 }} />
            <TextInput placeholder="Search" style={styles.searchInput} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Feather name="bell" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Setting")}>
            <Feather name="menu" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Summary Lists</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.addLink}>+ Add List</Text>
            </TouchableOpacity>
          </View>
          {renderListRows()}
        </View>

        {selectedListId && renderVideoCards()}
      </ScrollView>
      <CreateListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={loadLists}
      />

      <BottomNavigation />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff' },
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
    color: '#000',
  },
  icon: { marginHorizontal: 8 },
  section: { marginBottom: 24 },
  sectionHeader: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontWeight: 'bold', fontSize: 16 },
  addLink: { color: '#1E90FF' },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 16,
  },
  listButton: {
    flex: 1,
    backgroundColor: '#2D82DB',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  listText: { color: '#fff', fontWeight: '600' },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#dcdcdc',
    borderRadius: 8,
    marginBottom: 8,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  horizontalCard: {
    width: 160,

    marginRight: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  horizontalCardImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#dcdcdc',
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
});

export default LibraryScreen;
