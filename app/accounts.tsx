import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type StoredUser = { name: string; identifier: string; password: string };

export default function AccountsScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<StoredUser[]>([]);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("users");
      setAccounts(raw ? JSON.parse(raw) : []);
    })();
  }, []);

  const removeAccount = async (identifier: string) => {
    const raw = await AsyncStorage.getItem("users");
    const users: StoredUser[] = raw ? JSON.parse(raw) : [];
    const updated = users.filter((u) => u.identifier !== identifier);
    await AsyncStorage.setItem("users", JSON.stringify(updated));
    await AsyncStorage.removeItem(`profileImage:${identifier}`);
    setAccounts(updated);

    const currentRaw = await AsyncStorage.getItem("currentUser");
    const currentUser = currentRaw ? JSON.parse(currentRaw) : null;
    if (currentUser?.identifier === identifier) {
      await AsyncStorage.removeItem("currentUser");
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>All Accounts</Text>
        <View style={{ width: 22 }} />
      </View>

      {accounts.length === 0 ? (
        <Text style={styles.empty}>No accounts registered yet.</Text>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.identifier}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.identifier}>{item.identifier}</Text>
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeAccount(item.identifier)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "700" },
  empty: { textAlign: "center", color: "#999", marginTop: 60, fontSize: 13 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#eee" },
  name: { fontSize: 14, fontWeight: "600" },
  identifier: { fontSize: 12, color: "#888", marginTop: 2 },
  removeButton: { backgroundColor: "#FDE8E8", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  removeText: { color: "#C53030", fontWeight: "700", fontSize: 12 },
});