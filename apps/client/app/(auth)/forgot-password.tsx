import React, { useState } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
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
import { validateEmail } from "~/lib/validations";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const emailError = validateEmail(email);

    if (emailError) {
      setEmailError(emailError);
      isValid = false;
    }

    return isValid;
  };

  const handleResetPassword = async () => {
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement password reset logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setIsAlertOpen(true);
    } catch (error) {
      setEmailError("Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center items-center px-4 bg-background"
    >
      <Card className="w-full max-w-md p-6 bg-card rounded-xl shadow-lg">
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          Reset Password
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-6">
          Enter your email to reset your password
        </Text>

        <View className="space-y-4">
          <View>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:border-ring ${
                emailError ? "border-destructive" : "border-input"
              }`}
              onBlur={() => {
                if (email) {
                  validateForm();
                }
              }}
            />
            {emailError ? (
              <Text className="text-sm text-destructive mt-1">{emailError}</Text>
            ) : null}
          </View>

          <Button
            onPress={handleResetPassword}
            disabled={isSubmitting}
            variant="default"
            size="lg"
          >
            <Text className="text-primary-foreground font-semibold">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Text>
          </Button>

          <Button
            onPress={() => router.back()}
            variant="ghost"
            size="default"
          >
            <Text className="text-muted-foreground">
              Back to Login
            </Text>
          </Button>
        </View>
      </Card>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Check your email</AlertDialogTitle>
            <AlertDialogDescription>
              If an account exists with that email, we've sent password reset
              instructions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button
                onPress={() => {
                  setIsAlertOpen(false);
                  router.back();
                }}
                variant="default"
                size="sm"
              >
                <Text className="text-primary-foreground">OK</Text>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </KeyboardAvoidingView>
  );
}
