import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity,Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const notificationsData = [
  {
    id: '1',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '9:01 am',
    section: 'Today',
    avatar: require('../../Images/avtar.jpg'), 
  },
  {
    id: '2',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '9:01 am',
    section: 'Today',
    avatar: require('../../Images/avtar.jpg'),
  },
  {
    id: '3',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '9:01 am',
    section: 'Today',
    avatar: require('../../Images/avtar.jpg'),
  },
  {
    id: '4',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '9:01 am',
    section: 'Yesterday',
    avatar: require('../../Images/avtar.jpg'),
  },
  {
    id: '5',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '9:01 am',
    section: 'Yesterday',
    avatar: require('../../Images/avtar.jpg'),
  },
  {
    id: '6',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    time: '9:01 am',
    section: 'Yesterday',
    avatar: require('../Images/avtar.jpg'),
  },
];

const groupBySection = (data) => {
  const sections = {};
  data.forEach(item => {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });
  return Object.entries(sections).map(([title, data]) => ({ title, data }));
};

const Notification = ({ navigation }) => {
  const sections = groupBySection(notificationsData);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.data.map((notif) => (
              <View key={notif.id} style={styles.notificationItem}>
                <Image source={notif.avatar} style={styles.avatar} />
                <View style={styles.notificationText}>
                  <Text style={styles.message}>{notif.text}</Text>
                  <Text style={styles.time}>{notif.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginTop:height*0.05,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 12,
    marginTop: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
});

export default Notification;
