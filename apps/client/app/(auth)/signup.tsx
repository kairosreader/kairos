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
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFullName,
} from "~/lib/validations";
import { authService } from "~/lib/auth";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize registration flow when component mounts
  React.useEffect(() => {
    initializeRegistrationFlow();
  }, []);

  const initializeRegistrationFlow = async () => {
    try {
      const flow = await authService.initializeFlow("REGISTRATION");
      setFlowId(flow.id);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to initialize registration");
      setIsAlertOpen(true);
    }
  };

  const validateForm = useCallback(() => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(
      password,
      confirmPassword
    );
    const fullNameValidation = validateFullName(fullName);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);
    setFullNameError(fullNameValidation);

    return (
      !emailValidation &&
      !passwordValidation &&
      !confirmPasswordValidation &&
      !fullNameValidation
    );
  }, [email, password, confirmPassword, fullName]);

  const handleSignup = async () => {
    if (isSubmitting || !flowId) return;
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      if (!acceptTerms) {
        setErrorMessage("Please accept the terms and conditions");
        setIsAlertOpen(true);
        setIsSubmitting(false);
        return;
      }

      await authService.signup(flowId, email, password, fullName);
      // The auth service will handle the redirect to home
    } catch (error: any) {
      // If the flow expired, initialize a new one
      if (error.message?.includes('flow expired')) {
        await initializeRegistrationFlow();
        setErrorMessage("Your session expired. Please try again.");
      } else {
        setErrorMessage(error.message || "Registration failed");
      }
      setIsAlertOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError(validateEmail(text));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError(validatePassword(text));
    if (confirmPasswordError)
      setConfirmPasswordError(validateConfirmPassword(text, confirmPassword));
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError)
      setConfirmPasswordError(validateConfirmPassword(password, text));
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (fullNameError) setFullNameError(validateFullName(text));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center items-center px-4 bg-background"
    >
      <Card className="w-full max-w-md p-6 bg-card rounded-xl shadow-lg">
        <Text className="text-2xl font-bold text-center text-foreground mb-2">
          Create Account
        </Text>
        <Text className="text-base text-muted-foreground text-center mb-6">
          Sign up to get started
        </Text>

        <View className="space-y-4">
          <View>
            <Input
              placeholder="Full Name"
              value={fullName}
              onChangeText={handleFullNameChange}
              onBlur={() => setFullNameError(validateFullName(fullName))}
              autoCapitalize="words"
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:border-ring ${
                fullNameError ? "border-destructive" : "border-input"
              }`}
            />
            {fullNameError ? (
              <Text className="text-sm text-destructive mt-1">{fullNameError}</Text>
            ) : null}
          </View>

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
              <Text className="text-sm text-destructive mt-1">{emailError}</Text>
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
              <Text className="text-sm text-destructive mt-1">{passwordError}</Text>
            ) : null}
          </View>

          <View>
            <Input
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              onBlur={() =>
                setConfirmPasswordError(
                  validateConfirmPassword(password, confirmPassword)
                )
              }
              secureTextEntry
              className={`w-full px-4 py-2 bg-background border rounded-lg focus:border-ring ${
                confirmPasswordError ? "border-destructive" : "border-input"
              }`}
            />
            {confirmPasswordError ? (
              <Text className="text-sm text-destructive mt-1">
                {confirmPasswordError}
              </Text>
            ) : null}
          </View>

          <View className="flex-row items-center">
            <Checkbox
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked)}
              className="mr-2"
            />
            <Text className="text-sm text-muted-foreground">
              I accept the{" "}
              <Text
                className="text-primary hover:underline"
                onPress={() => router.push("/(auth)/terms")}
              >
                terms and conditions
              </Text>
            </Text>
          </View>

          <Button
            onPress={handleSignup}
            disabled={isSubmitting || !flowId}
            variant="default"
            size="lg"
          >
            <Text className="text-primary-foreground font-semibold">
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Text>
          </Button>

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-muted-foreground">
              Already have an account?{" "}
            </Text>
            <Button
              onPress={() => router.push("/(auth)/login")}
              variant="link"
              size="sm"
              className="px-0"
            >
              <Text className="text-primary font-semibold">
                Sign in
              </Text>
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
