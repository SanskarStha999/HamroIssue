import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotifications } from "../context/NotificationsContext";
import { useReports } from "../context/ReportsContext";

type CurrentUser = { name: string; identifier: string };

export default function ProfileScreen() {
  const router = useRouter();
  const { unreadCount } = useNotifications();
  const { reports, refresh } = useReports();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, []),
  );

  const reportedCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const storedUser = await AsyncStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        const storedAvatar = await AsyncStorage.getItem(
          `profileImage:${parsedUser.identifier}`,
        );
        if (storedAvatar) setAvatarUri(storedAvatar);
      }
    })();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo library access to set a profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0 && user) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      await AsyncStorage.setItem(`profileImage:${user.identifier}`, uri);
    }
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("currentUser");
          router.replace("/login");
        },
      },
    ]);
  };
  const showAllAccounts = async () => {
    const raw = await AsyncStorage.getItem("users");
    const users = raw ? JSON.parse(raw) : [];
    const list = users
      .map((u: any) => `• ${u.name} (${u.identifier})`)
      .join("\n");
    Alert.alert(
      `${users.length} account(s) registered`,
      list || "No accounts yet.",
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
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

      <View style={styles.avatarWrap}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#999" />
          </View>
        )}
        <View style={styles.onlineDot} />
        <TouchableOpacity style={styles.editBadge} onPress={pickImage}>
          <Ionicons name="pencil" size={12} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.name}>{user?.name ?? "Guest User"}</Text>
        <Text style={styles.infoLine}>Kathmandu, Nepal</Text>
        {user?.identifier && (
          <Text style={styles.infoLine}>{user.identifier}</Text>
        )}
      </View>

      <View style={styles.contributionsRow}>
        <Ionicons name="ribbon" size={16} color="#F5A623" />
        <Text style={styles.contributionsText}>0 Contributions</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#4B2FE0" }]}>0</Text>
          <Text style={styles.statLabel}>Reported</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#C53030" }]}>0</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: "#15803D" }]}>0</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addAccountButton}
        onPress={() => router.push("/register")}
      >
        <Ionicons name="person-add-outline" size={18} color="#4B2FE0" />
        <Text style={styles.addAccountText}>Add Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/accounts")}>
        <Text
          style={{
            textAlign: "center",
            color: "#999",
            fontSize: 12,
            marginTop: 12,
          }}
        >
          Show all accounts
        </Text>
      </TouchableOpacity>
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
    marginBottom: 20,
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
  avatarWrap: { alignSelf: "center", marginBottom: 20 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E5E5E5",
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#fff",
  },
  editBadge: {
    position: "absolute",
    top: -4,
    left: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  infoCard: {
    backgroundColor: "#F6F6F8",
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  infoLine: { fontSize: 13, color: "#666", marginBottom: 2 },
  contributionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 20,
  },
  contributionsText: { fontSize: 13, fontWeight: "600", color: "#333" },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 40 },
  statBox: {
    flex: 1,
    backgroundColor: "#F6F6F8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  statNumber: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 11, color: "#888", marginTop: 2 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#C0392B",
    borderRadius: 24,
    paddingVertical: 14,
  },
  logoutText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  addAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#4B2FE0",
    borderRadius: 24,
    paddingVertical: 12,
    marginTop: 12,
  },
  addAccountText: { color: "#4B2FE0", fontWeight: "700", fontSize: 14 },
});
