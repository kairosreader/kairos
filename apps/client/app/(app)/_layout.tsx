import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { authService } from "~/lib/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { STORAGE_KEYS } from "~/lib/constants";

const SERVER_URL_KEY = STORAGE_KEYS.SERVER_URL;

export default function AppLayout() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuthAndServer = async () => {
      try {
        // First check if server URL is configured
        const serverUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
        if (!serverUrl) {
          router.replace("/setup");
          return;
        }

        // Then check authentication
        try {
          await authService.getSession();
          // Only set ready if we have both server URL and valid session
          setIsReady(true);
        } catch (error) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        router.replace("/setup");
      }
    };

    checkAuthAndServer();
  }, []);

  // Show loading state until we've confirmed auth status
  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
      }}
    />
  );
}
