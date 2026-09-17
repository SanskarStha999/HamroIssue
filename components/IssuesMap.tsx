import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { issues } from "../constants/issues";
import { useReports } from "../context/ReportsContext";

type IssueStatus = "Pending" | "In Progress" | "Resolved";

const STATUS_COLORS: Record<IssueStatus, string> = {
  Pending: "#E53E3E",
  "In Progress": "#F59E0B",
  Resolved: "#22C55E",
};

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Potholes: "warning",
  Streetlights: "bulb",
  Dumping: "trash",
};

export default function IssuesMap({
  showMyReports = false,
}: {
  showMyReports?: boolean;
}) {
  const { reports } = useReports();
  const myPinned = showMyReports
    ? reports.filter((r) => r.latitude && r.longitude)
    : [];
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationEnabled(status === "granted");
    })();
  }, []);

  return (
    <MapView
      style={{ flex: 1, width: "100%", height: "100%" }}
      showsCompass={false}
      showsUserLocation={locationEnabled}
      initialRegion={{
        latitude: 27.6935,
        longitude: 85.282,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {issues.map((issue) => (
        <Marker
          key={issue.id}
          coordinate={{ latitude: issue.latitude, longitude: issue.longitude }}
          title={issue.title}
          description={issue.status}
          tracksViewChanges={false}
        >
          <View
            style={[
              styles.pin,
              { backgroundColor: STATUS_COLORS[issue.status as IssueStatus] },
            ]}
          >
            <Ionicons
              name={CATEGORY_ICONS[issue.category] ?? "alert-circle"}
              size={16}
              color="#fff"
            />
          </View>
        </Marker>
      ))}

      {myPinned.map((report) => (
        <Marker
          key={`my-${report.id}`}
          coordinate={{
            latitude: report.latitude!,
            longitude: report.longitude!,
          }}
          title={report.title}
          description={`Your report · ${report.status}`}
          tracksViewChanges={false}
        >
          <View
            style={[
              styles.myPin,
              { borderColor: STATUS_COLORS[report.status] },
            ]}
          >
            <Ionicons
              name="person"
              size={14}
              color={STATUS_COLORS[report.status]}
            />
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  myPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
});