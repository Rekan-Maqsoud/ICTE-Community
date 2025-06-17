import { Stack } from "expo-router";
import { AuthProvider } from "./AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  return (
  <GestureHandlerRootView  style={{ flex: 1 }}>
    <AuthProvider>
        <Stack screenOptions={{headerShown: false}}/>
    </AuthProvider>
  </GestureHandlerRootView>
  );
}
