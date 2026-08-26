import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !identifier || !password || !confirmPassword) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    try {
      const existingUsersRaw = await AsyncStorage.getItem('users');
      const users = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      const alreadyExists = users.some((u: any) => u.identifier === identifier);
      if (alreadyExists) {
        Alert.alert('Account exists', 'An account with this phone/email already exists.');
        return;
      }

      users.push({ name, identifier, password });
      await AsyncStorage.setItem('users', JSON.stringify(users));

      Alert.alert('Success', 'Account created! Please log in.');
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#4B2FE0', '#3A1FC7']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <Image
            source={require('../assets/images/logo.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Hamro Issue</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.welcome}>Register to Hamro Issue</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

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

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing you agree to our{' '}
            <Text style={styles.link}>Terms</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  logoImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  card: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, padding: 24 },
  welcome: { fontSize: 16, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 12, color: '#333', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F0F0F0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  button: {
    backgroundColor: '#4B2FE0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  terms: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 16, lineHeight: 16 },
  link: { color: '#4B2FE0', fontWeight: '600' },
});