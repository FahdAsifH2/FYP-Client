import { Stack } from "expo-router";
import { HealthProvider } from "./_contexts/HealthContext";
import { AuthProvider } from "./_contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css"

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <HealthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </HealthProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
