import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { validatePassword } from "~/lib/validations";
import { authService } from "~/lib/auth";

import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function SettingsScreen() {
  const { flow } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [flowData, setFlowData] = useState<any>(null);

  useEffect(() => {
    if (flow) {
      loadFlow();
    }
  }, [flow]);

  const loadFlow = async () => {
    try {
      const data = await authService.getSettingsFlow(flow as string);
      setFlowData(data);
    } catch (error: any) {
      setErrorMessage(
        error.message || "Failed to load settings. Please try again.",
      );
      setIsErrorDialogOpen(true);
    }
  };

  const validateForm = () => {
    setPasswordError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await authService.resetPassword(flow as string, password);
      setPassword("");
      setIsSuccessDialogOpen(true);
    } catch (error: any) {
      console.log("Settings error:", error);
      let errorMsg = error.message;
      console.log("Error message:", errorMsg);
      setErrorMessage(
        errorMsg || "Failed to update password. Please try again.",
      );
      setIsErrorDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseErrorDialog = () => {
    setIsErrorDialogOpen(false);
    if (errorMessage.includes("Invalid or expired")) {
      router.replace("/login");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-full max-w-sm">
            <Card>
              <CardHeader>
                <Text className="text-center text-2xl font-bold">
                  Update Password
                </Text>
                <Text className="text-center text-muted-foreground">
                  Enter your new password below
                </Text>
              </CardHeader>
              <CardContent>
                <View className="space-y-4">
                  <View>
                    <Input
                      placeholder="New Password"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      className={passwordError ? "border-destructive" : ""}
                    />
                    <Input
                      placeholder="Confirm New Password"
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      className={`mt-4 ${
                        passwordError ? "border-destructive" : ""
                      }`}
                    />
                    {passwordError ? (
                      <Text className="mt-2 text-sm text-destructive">
                        {passwordError}
                      </Text>
                    ) : null}
                  </View>
                  <Button
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Text>
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </KeyboardAvoidingView>

      <AlertDialog open={isSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password Updated</AlertDialogTitle>
            <AlertDialogDescription>
              Your password has been successfully updated. You can now use your
              new password to log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onPress={() => {
                setIsSuccessDialogOpen(false);
                router.replace("/");
              }}
            >
              <Text>Continue to Dashboard</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onPress={handleCloseErrorDialog}>
              <Text>OK</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
