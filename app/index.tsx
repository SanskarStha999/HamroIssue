import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#4B2FE0', '#3A1FC7']} style={styles.container}>
      <Image
        source={require('../assets/images/logo.jpg')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      <Text style={styles.appName}>Hamro Issue</Text>
      <Text style={styles.tagline}>स्थानीय समस्या हाम्रो समस्या</Text>

      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 45, // keeps it circular even if the JPG has a square edge
    marginBottom: 16,
  },
  appName: { color: '#fff', fontSize: 22, fontWeight: '600', marginBottom: 4 },
  tagline: { color: '#E0DAFF', fontSize: 13, marginBottom: 80 },
  progressTrack: {
    width: 140,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'absolute',
    bottom: 60,
  },
  progressFill: { width: '55%', height: '100%', backgroundColor: '#fff', borderRadius: 2 },
});