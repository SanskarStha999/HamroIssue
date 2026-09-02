import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useReports, MyReport } from "../context/ReportsContext";

const CATEGORIES: MyReport["category"][] = ["Potholes", "Streetlights", "Dumping"];

const DEFAULT_REGION = {
  latitude: 27.6935,
  longitude: 85.282,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function ReportIssueScreen() {
  const router = useRouter();
  const { addReport } = useReports();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [category, setCategory] = useState<MyReport["category"] | null>(null);
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [pin, setPin] = useState({ latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude });
  const [submitting, setSubmitting] = useState(false);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access to attach a photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!photoUri) {
      Alert.alert("Photo needed", "Please add a photo of the issue.");
      return;
    }
    if (!category) {
      Alert.alert("Category needed", "Please select a category.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Description needed", "Please describe the issue.");
      return;
    }

    setSubmitting(true);
    const report: MyReport = {
      id: Date.now().toString(),
      title: `New ${category} Report`,
      status: "Pending",
      category,
      location: "Pinned location, Kathmandu",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      upvotes: 0,
      image: { uri: photoUri },
    };

    await addReport(report);
    setSubmitting(false);
    Alert.alert("Report submitted", "Thanks for helping improve your community.", [
      { text: "OK", onPress: () => router.replace("/home") },
    ]);
  };

  const handleSaveDraft = () => {
    Alert.alert("Not built yet", "Saving drafts isn't implemented yet — this button is a placeholder for now.");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Report an Issue</Text>
        <Text style={styles.subtitle}>
          Illuminate your community by bringing local issues to light.
        </Text>

        <View style={styles.stepsRow}>
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Ionicons name="document-text" size={16} color="#fff" />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>DETAILS</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Ionicons name="location" size={16} color="#aaa" />
            </View>
            <Text style={styles.stepLabel}>LOCATION</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Ionicons name="eye" size={16} color="#aaa" />
            </View>
            <Text style={styles.stepLabel}>REVIEW</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="camera" size={14} color="#4B2FE0" />
            </View>
            <Text style={styles.cardHeaderText}>Capture the Issue</Text>
          </View>

          <TouchableOpacity style={styles.photoBox} onPress={pickPhoto}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={26} color="#999" />
                <Text style={styles.photoBoxText}>Upload or take photo</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>PROFESSIONAL TIP</Text>
            <Text style={styles.tipText}>
              Wide angle shots help our crews locate the issue faster. Ensure the area is well-lit for clarity.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="reader" size={14} color="#4B2FE0" />
            </View>
            <Text style={styles.cardHeaderText}>Describe the Issue</Text>
          </View>

          <Text style={styles.fieldLabel}>CATEGORY</Text>
          <TouchableOpacity style={styles.selectBox} onPress={() => setCategoryPickerOpen(true)}>
            <Text style={category ? styles.selectValue : styles.selectPlaceholder}>
              {category ?? "Select a Category"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#666" />
          </TouchableOpacity>

          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>DETAILED DESCRIPTION</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Provide context to help us resolve this quickly..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderIcon}>
              <Ionicons name="location" size={14} color="#4B2FE0" />
            </View>
            <Text style={styles.cardHeaderText}>Pin the Location</Text>
          </View>

          <View style={styles.mapBox}>
            <MapView
              style={StyleSheet.absoluteFill}
              initialRegion={DEFAULT_REGION}
              onPress={(e) => setPin(e.nativeEvent.coordinate)}
            >
              <Marker coordinate={pin} />
            </MapView>
          </View>
          <Text style={styles.mapHint}>Tap on the map to choose the exact spot</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>{submitting ? "Submitting..." : "Submit Report"}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSaveDraft}>
          <Text style={styles.saveDraft}>Save Draft</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={categoryPickerOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setCategoryPickerOpen(false)}
        >
          <View style={styles.modalCard}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={styles.modalOption}
                onPress={() => {
                  setCategory(c);
                  setCategoryPickerOpen(false);
                }}
              >
                <Text style={styles.modalOptionText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F6F8" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 55, paddingHorizontal: 20, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700", color: "#1A1033", paddingHorizontal: 20 },
  subtitle: { fontSize: 12, color: "#888", paddingHorizontal: 20, marginTop: 4, marginBottom: 20, lineHeight: 17 },
  stepsRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 30, marginBottom: 20 },
  stepItem: { alignItems: "center", width: 70 },
  stepCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#EFEFF4", alignItems: "center", justifyContent: "center" },
  stepCircleActive: { backgroundColor: "#4B2FE0" },
  stepLabel: { fontSize: 9, color: "#aaa", marginTop: 6, fontWeight: "600" },
  stepLabelActive: { color: "#4B2FE0" },
  stepLine: { flex: 1, height: 2, backgroundColor: "#4B2FE0", marginBottom: 20 },
  card: { backgroundColor: "#fff", borderRadius: 16, marginHorizontal: 20, padding: 16, marginBottom: 16 },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  cardHeaderIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: "#EEE9FC", alignItems: "center", justifyContent: "center" },
  cardHeaderText: { fontSize: 13, fontWeight: "700", color: "#1A1033" },
  photoBox: { borderWidth: 1.5, borderColor: "#C7C3E8", borderStyle: "dashed", borderRadius: 14, height: 130, alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFD", overflow: "hidden" },
  photoBoxText: { fontSize: 12, color: "#999", marginTop: 6 },
  photoPreview: { width: "100%", height: "100%" },
  tipBox: { backgroundColor: "#F6F6F8", borderRadius: 10, padding: 12, marginTop: 14 },
  tipTitle: { fontSize: 10, fontWeight: "700", color: "#666", marginBottom: 4, letterSpacing: 0.5 },
  tipText: { fontSize: 11, color: "#888", lineHeight: 16 },
  fieldLabel: { fontSize: 10, fontWeight: "700", color: "#888", marginBottom: 8, letterSpacing: 0.5 },
  selectBox: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F6F6F8", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  selectValue: { fontSize: 13, color: "#1A1033", fontWeight: "600" },
  selectPlaceholder: { fontSize: 13, color: "#999" },
  textArea: { backgroundColor: "#F6F6F8", borderRadius: 10, padding: 12, fontSize: 13, color: "#333", minHeight: 80, textAlignVertical: "top" },
  mapBox: { height: 130, borderRadius: 14, overflow: "hidden" },
  mapHint: { fontSize: 11, color: "#999", textAlign: "center", marginTop: 8 },
  submitButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#3A1FC7", marginHorizontal: 20, borderRadius: 24, paddingVertical: 15, marginTop: 4 },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  saveDraft: { textAlign: "center", color: "#888", fontSize: 12, marginTop: 14, fontWeight: "600" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 40 },
  modalCard: { backgroundColor: "#fff", borderRadius: 14, overflow: "hidden" },
  modalOption: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  modalOptionText: { fontSize: 14, color: "#333", fontWeight: "600" },
});