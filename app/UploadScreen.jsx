import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";

export default function UploadScreen() {
  const navigation = useNavigation();
  const [category, setCategory] = useState("Trending");
  const [videoUrl, setVideoUrl] = useState("");
  const router = useRouter();

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
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
