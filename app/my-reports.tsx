import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { statusColors } from "../constants/issues";
import { useNotifications } from "../context/NotificationsContext";
import { MyReport, useReports } from "../context/ReportsContext";

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Potholes: "warning",
  Streetlights: "bulb",
  Dumping: "trash",
};
const CATEGORY_COLORS: Record<string, string> = {
  Potholes: "#4B2FE0",
  Streetlights: "#F5A623",
  Dumping: "#22C55E",
};
const TABS = ["All", "Pending", "In Progress", "Resolved"];

export default function MyReportsScreen() {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const { reports, refresh, clearReports } = useReports();
  const [tab, setTab] = useState("All");

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, []),
  );

  const reportedCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;
  const filtered =
    tab === "All" ? reports : reports.filter((r) => r.status === tab);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
        <TouchableOpacity
          style={styles.headerBell}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications" size={18} color="#333" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#4B2FE0" }]}>
            {reportedCount}
          </Text>
          <Text style={styles.statLabel}>Reported</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#C53030" }]}>
            {pendingCount}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#15803D" }]}>
            {resolvedCount}
          </Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}>
            <View style={[styles.tabPill, tab === t && styles.tabPillActive]}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={40} color="#ccc" />
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptySubtitle}>
              Issues you report will show up here once the Report Issue form is
              built.
            </Text>
          </View>
        ) : (
          filtered.map((report) => (
            <View key={report.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: CATEGORY_COLORS[report.category] },
                  ]}
                >
                  <Ionicons
                    name={CATEGORY_ICONS[report.category]}
                    size={14}
                    color="#fff"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{report.title}</Text>
                  <Text style={styles.cardCode}>#{report.id.slice(-6)}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColors[report.status].bg },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusColors[report.status].text },
                    ]}
                  >
                    {report.status}
                  </Text>
                </View>
              </View>

              <Image source={report.image} style={styles.cardImage} />

              <View style={styles.cardMetaRow}>
                <Ionicons name="location-outline" size={12} color="#888" />
                <Text style={styles.cardMetaText}>{report.location}</Text>
              </View>
              <View style={styles.cardBottomRow}>
                <View style={styles.cardMetaRow}>
                  <Ionicons name="calendar-outline" size={12} color="#888" />
                  <Text style={styles.cardMetaText}>{report.date}</Text>
                </View>
                <View style={styles.cardMetaRow}>
                  <Ionicons name="thumbs-up" size={12} color="#4B2FE0" />
                  <Text style={styles.upvoteText}>{report.upvotes}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.back()}
        >
          <Ionicons name="home-outline" size={22} color="#999" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="document-text" size={22} color="#4B2FE0" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>
            My Reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/maps")}
        >
          <Ionicons name="map-outline" size={22} color="#999" />
          <Text style={styles.navLabel}>Maps</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={22} color="#999" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  headerBell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#E53E3E",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  notificationBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statBox: {
    flex: 1,
    backgroundColor: "#F6F6F8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  statNumber: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 11, color: "#888", marginTop: 2 },
  tabsRow: { flexDirection: "row", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
  },
  tabPillActive: { backgroundColor: "#4B2FE0" },
  tabText: { fontSize: 12, color: "#555" },
  tabTextActive: { color: "#fff", fontWeight: "600" },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    gap: 6,
    paddingHorizontal: 20,
  },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#555" },
  emptySubtitle: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 17,
  },
  devLink: { fontSize: 12, color: "#4B2FE0", fontWeight: "600", marginTop: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 13, fontWeight: "700" },
  cardCode: { fontSize: 10, color: "#aaa", marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: "600" },
  cardImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  cardMetaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardMetaText: { fontSize: 11, color: "#888" },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  upvoteText: { fontSize: 11, color: "#4B2FE0", fontWeight: "600" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    marginHorizontal: -20,
  },
  navItem: { alignItems: "center", gap: 2 },
  navLabel: { fontSize: 10, color: "#999" },
  navLabelActive: { color: "#4B2FE0", fontWeight: "600" },
});
