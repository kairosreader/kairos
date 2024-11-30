import React from "react";
import { View } from "react-native";
import { Text } from "./ui/text";

interface SessionInfoProps {
  session: any;
}

export function SessionInfo({ session }: SessionInfoProps) {
  const [timeLeft, setTimeLeft] = React.useState<string>("");

  React.useEffect(() => {
    const updateTimeLeft = () => {
      if (session?.expires_at) {
        const expiresAt = new Date(session.expires_at);
        setTimeLeft(expiresAt.toString());
      }
    };

    // Update immediately
    updateTimeLeft();

    // Update every minute
    const interval = setInterval(updateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [session?.expires_at]);

  if (!session?.expires_at) {
    return null;
  }

  return (
    <View className="mt-2">
      <Text className="text-sm text-center text-muted-foreground">
        Session expires {timeLeft}
      </Text>
    </View>
  );
}
