import React, { useState, useCallback } from "react";
import { View, KeyboardAvoidingView, Platform, Pressable } from "react-native";
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
import { Checkbox } from "~/components/ui/checkbox";
import { validateEmail, validatePassword } from "~/lib/validations";
import { authService } from "~/lib/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize login flow when component mounts
  React.useEffect(() => {
    initializeLoginFlow();
  }, []);

  const initializeLoginFlow = async () => {
    try {
      const flow = await authService.initializeLoginFlow();
      setFlowId(flow.id);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to initialize login");
      setIsAlertOpen(true);
    }
  };

  const validateForm = useCallback(() => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    return !emailValidation && !passwordValidation;
  }, [email, password]);

  const handleLogin = async () => {
    if (isSubmitting || !flowId) return;
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      await authService.login(flowId, email, password);
    } catch (error: any) {
      // If the flow expired, initialize a new one
      if (error.message?.includes("flow expired")) {
        await initializeLoginFlow();
        setErrorMessage("Your session expired. Please try again.");
      } else {
        setErrorMessage(error.message || "Invalid email or password");
      }
      setIsAlertOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(validateEmail(text));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(validatePassword(text));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center items-center px-4 bg-background"
    >
      <Card className="w-full max-w-md p-6 bg-card rounded-xl shadow-lg">
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          Welcome Back
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-6">
          Sign in to your account
        </Text>

        <View className="space-y-4">
          <View>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => setEmailError(validateEmail(email))}
              keyboardType="email-address"
              autoCapitalize="none"
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:border-ring ${
                emailError ? "border-destructive" : "border-input"
              }`}
            />
            {emailError ? (
              <Text className="text-sm text-destructive mt-1">
                {emailError}
              </Text>
            ) : null}
          </View>

          <View>
            <Input
              placeholder="Password"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => setPasswordError(validatePassword(password))}
              secureTextEntry
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:border-ring ${
                passwordError ? "border-destructive" : "border-input"
              }`}
            />
            {passwordError ? (
              <Text className="text-sm text-destructive mt-1">
                {passwordError}
              </Text>
            ) : null}
          </View>

          <View className="flex-row items-center">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked)}
              className="mr-2"
            />
            <Text className="text-sm text-muted-foreground">Remember me</Text>
          </View>

          <Button
            onPress={handleLogin}
            disabled={isSubmitting || !flowId}
            variant="default"
            size="lg"
          >
            <Text className="text-primary-foreground font-semibold">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Text>
          </Button>

          <Button
            onPress={() => router.push("/(auth)/forgot-password")}
            variant="link"
            size="sm"
            className="w-full"
          >
            <Text className="text-primary">Forgot password?</Text>
          </Button>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-muted-foreground">
              Don't have an account?{" "}
            </Text>
            <Button
              onPress={() => router.push("/(auth)/signup")}
              variant="link"
              size="sm"
              className="px-0"
            >
              <Text className="text-primary font-semibold">Sign up</Text>
            </Button>
          </View>
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
              <Button
                onPress={() => setIsAlertOpen(false)}
                variant="destructive"
                size="sm"
              >
                <Text className="text-destructive-foreground">OK</Text>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </KeyboardAvoidingView>
  );
}
