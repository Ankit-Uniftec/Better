import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
const { width, height } = Dimensions.get("window");
const CreateListModal = ({ visible, onClose, onSuccess }) => {
  const [listName, setListName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const { user } = useUser();

  const handleCreate = async () => {
    if (!listName.trim()) {
      Alert.alert("Please enter a list name");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const newList = {
      name: listName,
      isPublic,
      ownerId: user.id,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "summaryLists"), newList);
      setListName("");
      setIsPublic(true);
      onSuccess(); // refresh list
      onClose(); // close modal
    } catch (error) {
      console.error("Error saving list:", error);
      Alert.alert("Error", "Something went wrong while creating the list.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={modalStyles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={modalStyles.modalContent}>
          {/* Cross (X) Button */}
          <TouchableOpacity style={modalStyles.crossButton} onPress={onClose}>
            <Text style={modalStyles.crossText}>×</Text>
          </TouchableOpacity>

          <Text style={modalStyles.title}>Name your summary list</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Enter list name"
            value={listName}
            onChangeText={setListName}
          />

          <Text style={modalStyles.label}>List Type</Text>
          <View style={modalStyles.toggleContainer}>
            <TouchableOpacity
              style={[
                modalStyles.toggleButton,
                isPublic && modalStyles.selected,
              ]}
              onPress={() => setIsPublic(true)}
            >
              <Text style={modalStyles.toggleText}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                modalStyles.toggleButton,
                !isPublic && modalStyles.selected,
              ]}
              onPress={() => setIsPublic(false)}
            >
              <Text style={modalStyles.toggleText}>Private</Text>
            </TouchableOpacity>
          </View>

          <Text style={modalStyles.info}>
            Public lists will be visible to all users on the platform, while
            private lists will remain visible only to you and will not be shared
            with others.
          </Text>

          <TouchableOpacity
            style={modalStyles.createButton}
            onPress={handleCreate}
          >
            <Text style={modalStyles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  modalOverlay: {
    marginTop: height * 0.14,
    flex: 1,

    justifyContent: "center",
    borderRadius: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    height: "100%",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    position: "relative", // to position cross inside
  },
  crossButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  crossText: {
    fontSize: 24,
    color: "#888",
  },
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
    backgroundColor: "#2D82DB",
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
    backgroundColor: "#2D82DB",
    padding: 14,

    borderRadius: 16,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateListModal;
