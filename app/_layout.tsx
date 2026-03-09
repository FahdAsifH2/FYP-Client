import { Stack } from "expo-router";
import { HealthProvider } from "./contexts/HealthContext";
import { AuthProvider } from "./contexts/AuthContext";
import "../global.css"

export default function RootLayout() {
  return (
    <AuthProvider>
      <HealthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </HealthProvider>
    </AuthProvider>
  );
}
