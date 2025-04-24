import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';


const { width, height } = Dimensions.get("window");
const Profile = () => {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <BottomNavigation/>
    </View>
    
  )
}

const BottomNavigation = () => {
  const navigation = useNavigation();
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

      <TouchableOpacity onPress={() => navigation.navigate('LinkSummarizer')}>
        <Ionicons name="document-text-outline" size={24} color={getIconColor('LinkSummarizer')} />
        <Text style={[styles.navLabel, { color: getIconColor('LinkSummarizer') }]}>Summarizer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={24} color={getIconColor('Profile')} />
        <Text style={[styles.navLabel, { color: getIconColor('Profile') }]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },


    bottomNav: {
        marginTop: height*0.8,
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
})
export default Profile