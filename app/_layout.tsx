import { Stack } from "expo-router";
import { HealthProvider } from "./contexts/HealthContext";
import "../global.css"

export default function RootLayout() {
  return (
    <HealthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </HealthProvider>
  );
}
