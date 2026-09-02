import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { issues } from "../../constants/issues";
import { useVotes } from "../../context/VotesContext";

const STEP_LABELS = ["Reported", "Reviewed", "In Progress", "Resolved"];

function getDoneCount(status: string) {
  if (status === "Resolved") return 4;
  if (status === "In Progress") return 2;
  return 1;
}

export default function IssueDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const issue = issues.find((i) => i.id === id);

  const { isVoted, toggleVote } = useVotes();
  const voted = issue ? isVoted(issue.id) : false;
  const voteCount = (issue?.upvotes ?? 0) + (voted ? 1 : 0);

  const handleVote = () => {
    if (!issue) return;
    toggleVote(issue.id);
  };

  if (!issue) {
    return (
      <View style={styles.notFound}>
        <Text>Issue not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#4B2FE0", marginTop: 12 }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const doneCount = getDoneCount(issue.status);

  const handleShare = () => {
    Share.share({
      message: `${issue.title} — ${issue.location}. Reported on Hamro Issue.`,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <Image source={issue.image} style={styles.heroImage} />

      <View style={styles.content}>
        <View style={styles.timelineRow}>
          {STEP_LABELS.map((label, index) => {
            const isDone = index < doneCount;
            const isCurrent = index === doneCount && doneCount < 4;
            return (
              <React.Fragment key={label}>
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      isDone && styles.stepCircleDone,
                      isCurrent && styles.stepCircleCurrent,
                    ]}
                  >
                    {isDone && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                    {isCurrent && <View style={styles.stepCurrentDot} />}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      (isDone || isCurrent) && styles.stepLabelActive,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
                {index < STEP_LABELS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      index < doneCount && styles.stepLineDone,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        <Text style={styles.title}>{issue.title}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={13} color="#888" />
          <Text style={styles.metaText}>{issue.location}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={13} color="#888" />
          <Text style={styles.metaText}>{issue.date}</Text>
        </View>

        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
        <Text style={styles.description}>{issue.description}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.upvoteButton, voted && styles.upvoteButtonVoted]}
            onPress={handleVote}
          >
            <Ionicons
              name="thumbs-up"
              size={16}
              color={voted ? "#333" : "#fff"}
            />
            <Text
              style={[
                styles.upvoteButtonText,
                voted && styles.upvoteButtonTextVoted,
              ]}
            >
              {voteCount} Upvotes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={18} color="#4B2FE0" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>UPDATES</Text>
        <View style={styles.updateCard}>
          <View style={styles.updateIcon}>
            <Ionicons name="business-outline" size={16} color="#4B2FE0" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.updateFrom}>
              Dept. of Public Works · Verified Authority
            </Text>
            <Text style={styles.updateText}>
              {issue.status === "Resolved"
                ? "This issue has been resolved. Thank you for reporting it."
                : issue.status === "In Progress"
                  ? "A maintenance crew has been assigned and is scheduled to address this soon."
                  : "This report has been received and is awaiting review."}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>LOCATION</Text>
        <View style={styles.mapPreview}>
          <MapView
            style={StyleSheet.absoluteFill}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            pointerEvents="none"
            initialRegion={{
              latitude: issue.latitude,
              longitude: issue.longitude,
              latitudeDelta: 0.006,
              longitudeDelta: 0.006,
            }}
          >
            <Marker
              coordinate={{
                latitude: issue.latitude,
                longitude: issue.longitude,
              }}
            />
          </MapView>
          <TouchableOpacity
            style={styles.viewOnMapButton}
            onPress={() => router.push("/maps")}
          >
            <Ionicons name="map-outline" size={14} color="#333" />
            <Text style={styles.viewOnMapText}>VIEW ON MAP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 55,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 13, fontWeight: "700", color: "#4B2FE0" },
  heroImage: { width: "100%", height: 200, backgroundColor: "#eee" },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  stepItem: { alignItems: "center", width: 60 },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  stepCircleDone: { backgroundColor: "#4B2FE0", borderColor: "#4B2FE0" },
  stepCircleCurrent: { borderColor: "#F5A623" },
  stepCurrentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F5A623",
  },
  stepLabel: { fontSize: 9, color: "#aaa", marginTop: 4, textAlign: "center" },
  stepLabelActive: { color: "#333", fontWeight: "600" },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#ddd",
    marginTop: 12,
    marginHorizontal: -4,
  },
  stepLineDone: { backgroundColor: "#4B2FE0" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  metaText: { fontSize: 12, color: "#888" },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  description: { fontSize: 13, color: "#444", lineHeight: 20 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  upvoteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#4B2FE0",
    borderRadius: 24,
    paddingVertical: 12,
  },
  upvoteButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  upvoteButtonVoted: { backgroundColor: "#F5A623" },
  upvoteButtonTextVoted: { color: "#333" },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#4B2FE0",
    alignItems: "center",
    justifyContent: "center",
  },
  updateCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#F6F6FB",
    borderRadius: 14,
    padding: 14,
  },
  updateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E4E1FA",
    alignItems: "center",
    justifyContent: "center",
  },
  updateFrom: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B2FE0",
    marginBottom: 4,
  },
  updateText: { fontSize: 12, color: "#555", lineHeight: 17 },
  mapPreview: {
    height: 150,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
  },
  viewOnMapButton: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  viewOnMapText: { fontSize: 11, fontWeight: "700", color: "#333" },
});
