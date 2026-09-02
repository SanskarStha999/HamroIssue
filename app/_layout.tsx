import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationsProvider } from "../context/NotificationsContext";
import { ReportsProvider } from "../context/ReportsContext";
import { VotesProvider } from "../context/VotesContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationsProvider>
        <VotesProvider>
          <ReportsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
            </Stack>
          </ReportsProvider>
        </VotesProvider>
      </NotificationsProvider>
    </GestureHandlerRootView>
  );
}
