import React, { useEffect, useState } from "react";
import { View, Pressable, ActivityIndicator, Platform } from "react-native";
import { router } from "expo-router";
import { Text } from "~/components/ui/text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { toast } from "sonner-native";
import { STORAGE_KEYS } from "~/lib/constants";

const SERVER_URL_KEY = STORAGE_KEYS.SERVER_URL;

export default function ServerUrlScreen() {
  const [serverUrl, setServerUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web") {
      // On web, use the current URL as server URL and redirect to login
      const currentUrl = window.location.origin;
      validateAndStoreUrl(currentUrl);
    } else {
      // On mobile, check if we already have a server URL
      AsyncStorage.getItem(SERVER_URL_KEY).then((url) => {
        if (url) {
          router.replace("/login");
        }
      });
    }
  }, []);

  const validateAndStoreUrl = async (url: string) => {
    setIsLoading(true);

    try {
      // Remove trailing slash before parsing URL
      const cleanUrl = url.replace(/\/+$/, "");
      const parsedUrl = new URL(cleanUrl);
      const originWithoutPort = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

      try {
        console.log(originWithoutPort);
        const response = await fetch(`${originWithoutPort}/api/ping`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Server is not responding correctly");
        }

        await AsyncStorage.setItem(SERVER_URL_KEY, originWithoutPort);
        router.replace("/login");
      } catch (e) {
        toast.error(
          "Unable to connect to server. Please check the URL and try again.",
        );
      }
    } catch (e) {
      toast.error("Please enter a valid URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!serverUrl) {
      toast.error("Please enter a server URL");
      return;
    }
    validateAndStoreUrl(serverUrl);
  };

  if (Platform.OS === "web") {
    // If the web platform got here, then the server must be broken.
    return <WebErrorScreen />;
  }

  return (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <ServerUrlForm
        serverUrl={serverUrl}
        onChangeUrl={setServerUrl}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </View>
  );
}

function WebErrorScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Text className="text-2xl font-bold text-center text-card-foreground">
            Connection Error
          </Text>
        </CardHeader>
        <CardContent>
          <Text className="text-center text-muted-foreground mb-6">
            Unable to connect to the server. Please check if the server is
            running and try again.
          </Text>
          <Pressable
            className="bg-primary p-4 rounded-lg active:opacity-80"
            onPress={() => window.location.reload()}
          >
            <Text className="text-primary-foreground text-center font-semibold">
              Retry Connection
            </Text>
          </Pressable>
        </CardContent>
      </Card>
    </View>
  );
}

function ServerUrlForm({
  serverUrl,
  onChangeUrl,
  isLoading,
  onSubmit,
}: {
  serverUrl: string;
  onChangeUrl: (text: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}) {
  return (
    <Card className="w-full max-w-sm">
      <View className="h-full flex justify-between">
        <View>
          <CardHeader>
            <Text className="text-2xl font-bold text-center text-card-foreground">
              Kairos
            </Text>
          </CardHeader>
          <CardContent className="h-24">
            <Text className="text-sm font-medium text-foreground mb-2">
              Server URL
            </Text>
            <Input
              value={serverUrl}
              onChangeText={onChangeUrl}
              placeholder="https://your-server.com"
              placeholderTextColor="#666"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              editable={!isLoading}
            />
          </CardContent>
        </View>
        <CardContent className="pt-0">
          <ConnectButton isLoading={isLoading} onPress={onSubmit} />
        </CardContent>
      </View>
    </Card>
  );
}

function ConnectButton({
  isLoading,
  onPress,
}: {
  isLoading: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`bg-primary p-4 rounded-lg ${
        isLoading ? "opacity-50" : "active:opacity-80"
      }`}
      onPress={onPress}
      disabled={isLoading}
    >
      <View className="flex-row justify-center items-center">
        {isLoading ? <ActivityIndicator color="#fff" className="mr-2" /> : null}
        <Text className="text-primary-foreground text-center font-semibold">
          {isLoading ? "Connecting..." : "Connect"}
        </Text>
      </View>
    </Pressable>
  );
}
