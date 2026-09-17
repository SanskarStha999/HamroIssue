import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";
import { useLocationPicker } from "../context/LocationPickerContext";

export default function PickLocationScreen() {
  const router = useRouter();
  const { lat, lng } = useLocalSearchParams<{ lat?: string; lng?: string }>();
  const { setPickedLocation } = useLocationPicker();

  const initialLatitude = lat ? parseFloat(lat) : 27.6935;
  const initialLongitude = lng ? parseFloat(lng) : 85.282;

  const [center, setCenter] = useState({ latitude: initialLatitude, longitude: initialLongitude });
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationEnabled(status === "granted");
    })();
  }, []);

  const handleConfirm = () => {
    setPickedLocation(center);
    router.back();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        showsUserLocation={locationEnabled}
        initialRegion={{
          latitude: initialLatitude,
          longitude: initialLongitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChangeComplete={(region) =>
          setCenter({ latitude: region.latitude, longitude: region.longitude })
        }
      />

      <View style={styles.centerPinWrap} pointerEvents="none">
        <Ionicons name="location" size={44} color="#E53E3E" />
      </View>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pin the Location</Text>
        <View style={{ width: 36 }} />
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Ionicons name="checkmark-circle" size={18} color="#fff" />
        <Text style={styles.confirmButtonText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerPinWrap: { position: "absolute", top: "50%", left: "50%", marginLeft: -22, marginTop: -44 },
  header: { position: "absolute", top: 60, left: 16, right: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  headerTitle: { fontSize: 14, fontWeight: "700", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  confirmButton: { position: "absolute", bottom: 50, alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#3A1FC7", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 28, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  confirmButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});