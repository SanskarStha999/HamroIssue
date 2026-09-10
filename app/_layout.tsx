import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { NotificationsProvider } from '../context/NotificationsContext';
import { VotesProvider } from '../context/VotesContext';
import { ReportsProvider } from '../context/ReportsContext';
import { LocationPickerProvider } from '../context/LocationPickerContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationsProvider>
        <VotesProvider>
          <ReportsProvider>
            <LocationPickerProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="login" />
              </Stack>
            </LocationPickerProvider>
          </ReportsProvider>
        </VotesProvider>
      </NotificationsProvider>
    </GestureHandlerRootView>
  );
}