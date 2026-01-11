import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initDatabase } from "../db/client";
import "./global.css";

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    // Initialize database on app start
    initDatabase().catch((error) => {
      console.error("Failed to initialize database:", error);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="(modals)/camera" 
            options={{ presentation: "modal" }} 
          />
          <Stack.Screen 
            name="(modals)/create-log" 
            options={{ presentation: "modal" }} 
          />
          <Stack.Screen 
            name="(modals)/view-photo" 
            options={{ presentation: "fullScreenModal" }} 
          />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
