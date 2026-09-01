import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { NotificationsProvider } from '../context/NotificationsContext';
import { VotesProvider } from '../context/VotesContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationsProvider>
        <VotesProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
          </Stack>
        </VotesProvider>
      </NotificationsProvider>
    </GestureHandlerRootView>
  );
}