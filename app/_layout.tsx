import { Stack } from 'expo-router';
import { NotificationsProvider } from '../context/NotificationsContext';

export default function RootLayout() {
  return (
    <NotificationsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack>
    </NotificationsProvider>
  );
}