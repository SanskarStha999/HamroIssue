// components/IssuesMap.tsx
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type IssueStatus = "Pending" | "In Progress" | "Resolved";

type MapIssue = {
  id: string;
  title: string;
  status: IssueStatus;
  icon: keyof typeof Ionicons.glyphMap;
  latitude: number;
  longitude: number;
};

const STATUS_COLORS: Record<IssueStatus, string> = {
  Pending: "#E53E3E",
  "In Progress": "#F59E0B",
  Resolved: "#22C55E",
};

const issues: MapIssue[] = [
  {
    id: "1",
    title: "Deep Pothole on Main road",
    status: "Pending",
    icon: "warning",
    latitude: 27.6939,
    longitude: 85.282,
  },
  {
    id: "2",
    title: "Broken Street Light",
    status: "In Progress",
    icon: "bulb",
    latitude: 27.6945,
    longitude: 85.2836,
  },
  {
    id: "3",
    title: "Garbage Management",
    status: "Resolved",
    icon: "trash",
    latitude: 27.6928,
    longitude: 85.2808,
  },
];

export default function IssuesMap() {
  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      showsCompass={false}
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
        >
          <View
            style={[
              styles.pin,
              { backgroundColor: STATUS_COLORS[issue.status] },
            ]}
          >
            <Ionicons name={issue.icon} size={16} color="#fff" />
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
});
