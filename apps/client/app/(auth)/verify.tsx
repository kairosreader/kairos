import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from "~/components/ui/alert-dialog";
import { authService } from "~/lib/auth";

export default function VerifyScreen() {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { flow, email, code } = useLocalSearchParams();

  useEffect(() => {
    // Initialize verification flow if we don't have a flow ID
    if (!flow) {
      const initFlow = async () => {
        try {
          const response = await authService.initializeVerificationFlow();
          // The response will be handled by the auth service
        } catch (err) {
          setError("Failed to initialize verification flow");
          setShowError(true);
        }
      };
      initFlow();
    }
  }, [flow]);

  useEffect(() => {
    if (code) {
      setVerificationCode(code as string);
    }
  }, [code]);

  const handleVerification = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!verificationCode.trim()) {
        setError("Please enter the verification code");
        setShowError(true);
        return;
      }

      await authService.verifyEmail(flow as string, {
        method: "code",
        code: verificationCode,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6">
          <Text className="mb-6 text-center text-2xl font-bold">
            Verify Your Email
          </Text>

          <Text className="mb-4 text-center text-muted-foreground">
            Please enter the verification code sent to{" "}
            {email ? email : "your email"}
          </Text>

          <Input
            placeholder="Enter verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            className="mb-4"
            keyboardType="number-pad"
            maxLength={6}
          />

          <Button
            className="w-full"
            onPress={handleVerification}
          >
            <Text>{isLoading ? "Verifying..." : "Verify"}</Text>
          </Button>

          <Pressable onPress={() => router.back()} className="mt-4">
            <Text className="text-center text-primary">Go Back</Text>
          </Pressable>
        </Card>
      </View>

      <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onPress={() => setShowError(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </KeyboardAvoidingView>
  );
}
