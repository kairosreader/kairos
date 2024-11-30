import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardHeader, CardContent } from '~/components/ui/card';
import { authService } from '~/lib/auth';
import { SessionInfo } from '~/components/session-info';

export default function HomePage() {
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    // Get session info on mount
    const getSessionInfo = async () => {
      try {
        const sessionData = await authService.getSession();
        setSession(sessionData);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    getSessionInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <Text className="text-2xl font-bold text-center text-card-foreground">
            Welcome to Kairos
          </Text>
        </CardHeader>
        <CardContent>
          {session && (
            <View className="mb-6">
              <Text className="text-center text-muted-foreground">
                Logged in as: {session.identity?.traits?.email}
              </Text>
              <SessionInfo session={session} />
            </View>
          )}
          <Pressable
            className="bg-primary p-4 rounded-lg active:opacity-80"
            onPress={handleLogout}
          >
            <Text className="text-center font-semibold text-primary-foreground">
              Logout
            </Text>
          </Pressable>
        </CardContent>
      </Card>
    </View>
  );
}
