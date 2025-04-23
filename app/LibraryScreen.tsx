import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';

const LibraryScreen = () => {
  const navigation = useNavigation<any>();
  const [summaryLists, setSummaryLists] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadLists();
    });

    return unsubscribe;
  }, [navigation]);

  const loadLists = async () => {
    try {
      const storedLists = await AsyncStorage.getItem('summaryLists');
      if (storedLists) {
        setSummaryLists(JSON.parse(storedLists));
      }
    } catch (error) {
      console.error('Failed to load lists:', error);
    }
  };

  const chunkArray = (arr, size) => {
    const chunked = [];
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
          <TouchableOpacity key={list.id} style={styles.listButton}>
            <Text style={styles.listText}>{list.name}</Text>
          </TouchableOpacity>
        ))}
        {row.length < 2 && <View style={[styles.listButton, { backgroundColor: 'transparent' }]} />}
      </View>
    ));
  };

  return (

    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Summary Lists</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CreateListScreen')}>
              <Text style={styles.addLink}>+ Add List</Text>
            </TouchableOpacity>
          </View>

          {renderListRows()}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Public Lists - Betterfluencers</Text>
            <TouchableOpacity><Text style={styles.addLink}>See more</Text></TouchableOpacity>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.card}><Image style={styles.cardImage} /><Text>Title</Text></View>
            <View style={styles.card}><Image style={styles.cardImage} /><Text>Title</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Summaries</Text>
            <TouchableOpacity><Text style={styles.addLink}>See more</Text></TouchableOpacity>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.card}><Image style={styles.cardImage} /><Text>Title</Text></View>
            <View style={styles.card}><Image style={styles.cardImage} /><Text>Title</Text></View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>


  );

};





const BottomNavigation = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const getIconColor = (screenName: string) => {
    return route.name === screenName ? '#007BFF' : '#999';
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate('MainPage')}>
        <Ionicons name="home-outline" size={24} color={getIconColor('MainPage')} />
        <Text style={[styles.navLabel, { color: getIconColor('MainPage') }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LibraryScreen')}>
        <Ionicons name="library-outline" size={24} color={getIconColor('LibraryScreen')} />
        <Text style={[styles.navLabel, { color: getIconColor('LibraryScreen') }]}>Library</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Summarize')}>
        <Ionicons name="document-text-outline" size={24} color={getIconColor('Summarize')} />
        <Text style={[styles.navLabel, { color: getIconColor('Summarize') }]}>Summarize</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={24} color={getIconColor('Profile')} />
        <Text style={[styles.navLabel, { color: getIconColor('Profile') }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff', },
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
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
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

  bottomNav: {
    marginTop: 0,
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

export default LibraryScreen;
