import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CreateListScreen = () => {
  const [listName, setListName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const navigation = useNavigation();

  const handleCreate = async () => {
    if (!listName.trim()) {
      Alert.alert("Please enter a list name");
      return;
    }

    const newList = {
      name: listName,
      isPublic,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "summaryLists"), newList);
      setListName("");
      setIsPublic(true);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving list:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Name your summary list</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter list name"
        value={listName}
        onChangeText={setListName}
      />

      <Text style={styles.label}>List Type</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isPublic && styles.selected]}
          onPress={() => setIsPublic(true)}
        >
          <Text style={styles.toggleText}>Public List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isPublic && styles.selected]}
          onPress={() => setIsPublic(false)}
        >
          <Text style={styles.toggleText}>Private List</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.info}>
        {isPublic
          ? "Public lists will be visible to all users on the platform."
          : "Private lists will remain visible only to you and will not be shared with others."}
      </Text>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  label: { fontWeight: "600", fontSize: 14, marginBottom: 10 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 4,
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#222",
    borderRadius: 8,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#1E90FF",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "500",
  },
  info: {
    color: "#666",
    fontSize: 12,
    marginBottom: 30,
    marginTop: 10,
  },
  createButton: {
    backgroundColor: "#1E90FF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateListScreen;

