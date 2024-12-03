import React, { useState, useEffect } from "react";
import { View, Platform, Pressable, KeyboardAvoidingView } from "react-native";
import { router } from "expo-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "~/lib/constants";

const SERVER_URL_KEY = STORAGE_KEYS.SERVER_URL;

export default function ServerUrlScreen() {
  const [serverUrl, setServerUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [urlError, setUrlError] = useState("");

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

  const validateUrl = (url: string) => {
    if (!url) {
      return "Please enter a server URL";
    }
    try {
      // Remove trailing slash before parsing URL
      const cleanUrl = url.replace(/\/+$/, "");
      new URL(cleanUrl);
      return "";
    } catch (e) {
      return "Please enter a valid URL";
    }
  };

  const validateAndStoreUrl = async (url: string) => {
    setIsLoading(true);
    setUrlError("");

    const validationError = validateUrl(url);
    if (validationError) {
      setUrlError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      const cleanUrl = url.replace(/\/+$/, "");
      const parsedUrl = new URL(cleanUrl);
      const originWithoutPort = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

      try {
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
        setErrorMessage(
          "Unable to connect to server. Please check the URL and try again.",
        );
        setIsAlertOpen(true);
      }
    } catch (e) {
      setUrlError("Please enter a valid URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    validateAndStoreUrl(serverUrl);
  };

  const handleUrlChange = (text: string) => {
    setServerUrl(text);
    if (urlError) {
      setUrlError(validateUrl(text));
    }
  };

  if (Platform.OS === "web") {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md p-6 bg-card rounded-xl shadow-lg">
          <Text className="text-2xl font-bold text-center text-card-foreground">
            Connection Error
          </Text>
          <Text className="text-center text-muted-foreground mb-6">
            Unable to connect to the server. Please check if the server is
            running and try again.
          </Text>
          <Button
            onPress={() => window.location.reload()}
            variant="default"
            size="lg"
          >
            <Text className="text-primary-foreground font-semibold">
              Retry Connection
            </Text>
          </Button>
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center items-center px-4 bg-background"
    >
      <Card className="w-full max-w-md p-6 bg-card rounded-xl shadow-lg">
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          Kairos
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-6">
          Connect to your server
        </Text>

        <View className="space-y-4">
          <View>
            <Input
              placeholder="Server URL"
              value={serverUrl}
              onChangeText={handleUrlChange}
              onBlur={() => setUrlError(validateUrl(serverUrl))}
              autoCapitalize="none"
              autoCorrect={false}
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:border-ring mb-3 ${
                urlError ? "border-destructive" : "border-input"
              }`}
            />
            {urlError ? (
              <Text className="text-sm text-destructive mt-1">{urlError}</Text>
            ) : null}
          </View>

          <Button
            onPress={handleSubmit}
            disabled={isLoading}
            variant="default"
            size="lg"
          >
            <Text className="text-primary-foreground font-semibold">
              {isLoading ? "Connecting..." : "Connect"}
            </Text>
          </Button>
        </View>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Pressable
                className="bg-primary px-4 py-2 rounded-md"
                onPress={() => setIsAlertOpen(false)}
              >
                <Text className="text-primary-foreground font-medium">OK</Text>
              </Pressable>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </KeyboardAvoidingView>
  );
}
