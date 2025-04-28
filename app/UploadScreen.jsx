import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";

export default function UploadScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [category, setCategory] = useState("Trending");
  const [videoUrl, setVideoUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingUrl, setEditingUrl] = useState("");
  const [editingCategory, setEditingCategory] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "videos"), (snapshot) => {
      const fetchedVideos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(fetchedVideos);
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = async () => {
    if (!videoUrl) {
      Alert.alert("Error", "Please enter a YouTube video URL");
      return;
    }
    try {
      await addDoc(collection(db, "videos"), {
        category,
        videoUrl,
        createdAt: new Date(),
      });
      Alert.alert("Success", "Video uploaded successfully");
      setVideoUrl("");
      setCategory("Trending");
    } catch (error) {
      Alert.alert("Error", "Failed to upload video");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "videos", id));
      Alert.alert("Deleted", "Video deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete video");
      console.error(error);
    }
  };

  const handleEdit = (video) => {
    setEditingId(video.id);
    setEditingUrl(video.videoUrl);
    setEditingCategory(video.category);
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "videos", editingId), {
        videoUrl: editingUrl,
        category: editingCategory,
      });
      Alert.alert("Updated", "Video updated successfully");
      setEditingId(null);
      setEditingUrl("");
      setEditingCategory("");
    } catch (error) {
      Alert.alert("Error", "Failed to update video");
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {editingId === item.id ? (
        <>
          <Picker
            selectedValue={editingCategory}
            onValueChange={(value) => setEditingCategory(value)}
            style={styles.editPicker}
          >
            <Picker.Item label="Trending" value="Trending" />
            <Picker.Item label="Popular" value="Popular" />
          </Picker>
          <TextInput
            value={editingUrl}
            onChangeText={setEditingUrl}
            style={styles.input}
          />
          <Button title="Save" onPress={handleUpdate} />
          <Button title="Cancel" color="gray" onPress={() => setEditingId(null)} />
        </>
      ) : (
        <>
          <Text style={styles.text}><Text style={{fontWeight: "bold"}}>Category:</Text> {item.category}</Text>
          <Text style={styles.text}><Text style={{fontWeight: "bold"}}>URL:</Text> {item.videoUrl}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Category:</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Trending" value="Trending" />
        <Picker.Item label="Popular" value="Popular" />
      </Picker>

      <Text style={styles.label}>YouTube Video URL:</Text>
      <TextInput
        style={styles.input}
        placeholder="Paste YouTube video URL here"
        value={videoUrl}
        onChangeText={setVideoUrl}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Button title="Upload" onPress={handleUpload} />
      <Button
        title="Go to Display Screen"
        onPress={() => router.push("/MainPage")}
        style={{ marginTop: 10 }}
      />

      <Text style={styles.listTitle}>Uploaded Videos:</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    marginBottom: 16,
  },
  editPicker: {
    height: 50,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 100,
  },
  item: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
});
