import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { issues, statusColors } from "../constants/issues";

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const trimmedQuery = query.trim().toLowerCase();

  const results = trimmedQuery
    ? issues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(trimmedQuery) ||
          issue.category.toLowerCase().includes(trimmedQuery),
      )
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#888" />
        <TextInput
          autoFocus
          value={query}
          onChangeText={setQuery}
          placeholder="Search in options"
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
        <Ionicons name="mic" size={18} color="#888" />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}>
        {trimmedQuery === "" ? (
          <Text style={styles.hint}>
            Try "potholes", "streetlights", or "dumping"
          </Text>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={40} color="#ccc" />
            <Text style={styles.emptyTitle}>Search not found</Text>
            <Text style={styles.emptySubtitle}>No issues match "{query}"</Text>
          </View>
        ) : (
          results.map((issue) => (
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
          ))
        )}
      </ScrollView>
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
  header: { marginBottom: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 13 },
  hint: { textAlign: "center", color: "#999", fontSize: 13, marginTop: 40 },
  emptyState: { alignItems: "center", marginTop: 60, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#555" },
  emptySubtitle: { fontSize: 12, color: "#999" },
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
});
