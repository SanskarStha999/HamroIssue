import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotifications } from "../context/NotificationsContext";

const ICONS = {
  review: { name: "checkmark-circle", bg: "#3B4CCA" },
  support: { name: "thumbs-up", bg: "#F5A623" },
  progress: { name: "construct", bg: "#8B95A5" },
} as const;

export default function NotificationsScreen() {
  const router = useRouter();
  const { items, markAllRead, markOneRead } = useNotifications();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerBell}>
          <Ionicons name="notifications" size={18} color="#333" />
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.row, item.unread && styles.rowUnread]}
            onPress={() => markOneRead(item.id)}
          >
            <View style={[styles.iconCircle, { backgroundColor: ICONS[item.type].bg }]}>
              <Ionicons name={ICONS[item.type].name} size={18} color="#fff" />
            </View>
            <View style={styles.textBlock}>
              <View style={styles.rowTop}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.timeRow}>
                  <Text style={styles.time}>{item.time}</Text>
                  {item.unread && <View style={styles.dot} />}
                </View>
              </View>
              <Text style={styles.description} numberOfLines={1}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  headerBell: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center" },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#1A1033" },
  markRead: { fontSize: 12, color: "#F5A623", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 12, borderRadius: 12, marginBottom: 6 },
  rowUnread: { backgroundColor: "#EEF0FF" },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  textBlock: { flex: 1 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemTitle: { fontSize: 13, fontWeight: "700", color: "#4B2FE0" },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  time: { fontSize: 11, color: "#999" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4B2FE0" },
  description: { fontSize: 12, color: "#666", marginTop: 2 },
});