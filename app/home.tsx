import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import IssuesMap from "../components/IssuesMap";
import { issues, statusColors } from "../constants/issues";
import { useNotifications } from "../context/NotificationsContext";

export default function HomeScreen() {
  const router = useRouter();
  const [tab, setTab] = React.useState("All");
  const { unreadCount } = useNotifications();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["48%", "92%"], []);

  const filteredIssues =
    tab === "All" ? issues : issues.filter((issue) => issue.category === tab);

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <IssuesMap />
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.8}
          onPress={() => router.push("/search")}
        >
          <Ionicons name="search" size={18} color="#888" />
          <View pointerEvents="none" style={{ flex: 1 }}>
            <TextInput
              placeholder="Search in options"
              style={styles.searchInput}
              placeholderTextColor="#888"
              editable={false}
            />
          </View>
          <Ionicons name="mic" size={18} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications-outline" size={20} color="#333" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        handleIndicatorStyle={styles.sheetHandle}
        backgroundStyle={styles.sheetBackground}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Nearby Issues</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabsRow}>
            {["All", "Potholes", "Streetlights", "Dumping"].map((t) => (
              <TouchableOpacity key={t} onPress={() => setTab(t)}>
                <View
                  style={[styles.tabPill, tab === t && styles.tabPillActive]}
                >
                  <Text
                    style={[styles.tabText, tab === t && styles.tabTextActive]}
                  >
                    {t}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {filteredIssues.map((issue) => (
            <View key={issue.id} style={styles.issueCard}>
              <Image source={issue.image} style={styles.issueImage} />
              <View style={styles.issueInfo}>
                <Text style={styles.issueTitle}>{issue.title}</Text>
                <View style={styles.issueLocationRow}>
                  <Ionicons name="location-outline" size={12} color="#888" />
                  <Text style={styles.issueLocation}>{issue.location}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColors[issue.status].bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusColors[issue.status].text },
                    ]}
                  >
                    {issue.status}
                  </Text>
                </View>
              </View>
              <View style={styles.upvoteBox}>
                <Ionicons name="thumbs-up" size={12} color="#4B2FE0" />
                <Text style={styles.upvoteText}>{issue.upvotes}</Text>
              </View>
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>

      <TouchableOpacity style={styles.reportButton}>
        <Ionicons name="add" size={18} color="#fff" />
        <Text style={styles.reportButtonText}>Report Issue</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Home" active />
        <NavItem icon="document-text-outline" label="My Reports" />
        <NavItem icon="map-outline" label="Maps" />
        <NavItem icon="person-outline" label="Profile" />
      </View>
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.navItem}>
      <Ionicons name={icon} size={22} color={active ? "#4B2FE0" : "#999"} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mapPlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#E8ECE3",
  },
  searchBar: {
    position: "absolute",
    top: 65,
    left: 16,
    right: 60,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 13 },
  bellButton: {
    position: "absolute",
    top: 65,
    right: 16,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#E53E3E",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  notificationBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  sheetHandle: { backgroundColor: "#ddd", width: 40, height: 4 },
  sheetBackground: { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  sheetContent: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 100 },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sheetTitle: { fontSize: 16, fontWeight: "700" },
  seeAll: { fontSize: 13, color: "#4B2FE0", fontWeight: "600" },
  tabsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
  },
  tabPillActive: { backgroundColor: "#4B2FE0" },
  tabText: { fontSize: 12, color: "#555" },
  tabTextActive: { color: "#fff", fontWeight: "600" },
  issueCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  issueImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  issueInfo: { flex: 1 },
  issueTitle: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  issueLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  issueLocation: { fontSize: 11, color: "#888" },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: { fontSize: 10, fontWeight: "600" },
  upvoteBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  upvoteText: { fontSize: 12, color: "#4B2FE0", fontWeight: "600" },
  reportButton: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    backgroundColor: "#F5A623",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  reportButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  navItem: { alignItems: "center", gap: 2 },
  navLabel: { fontSize: 10, color: "#999" },
  navLabelActive: { color: "#4B2FE0", fontWeight: "600" },
});
