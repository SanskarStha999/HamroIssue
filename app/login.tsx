import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Missing info", "Please enter both fields.");
      return;
    }

    try {
      const existingUsersRaw = await AsyncStorage.getItem("users");
      const users = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      const match = users.find(
        (u: any) => u.identifier === identifier && u.password === password,
      );

      if (match) {
        await AsyncStorage.setItem("currentUser", JSON.stringify(match));
        router.replace("/home");
      } else {
        Alert.alert("Login failed", "Incorrect phone/email or password.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <LinearGradient colors={["#4B2FE0", "#3A1FC7"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Image
            source={require("../assets/images/logo.jpg")}
            style={styles.logoImageSmall}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Hamro Issue</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.welcome}>Welcome to Hamro Issue</Text>

          <Text style={styles.label}>Phone or E-mail</Text>
          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerText}>or register</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing you agree to our{" "}
            <Text style={styles.link}>Terms</Text> and{" "}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  logoImageSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
  },
  welcome: { fontSize: 16, fontWeight: "700", marginBottom: 20 },
  label: { fontSize: 12, color: "#333", marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  loginButton: {
    backgroundColor: "#4B2FE0",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 24,
  },
  loginButtonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  registerText: {
    textAlign: "center",
    color: "#555",
    marginTop: 12,
    fontSize: 13,
  },
  terms: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 16,
  },
  link: { color: "#4B2FE0", fontWeight: "600" },
});
