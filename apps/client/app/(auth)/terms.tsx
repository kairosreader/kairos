import React from "react";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";

export default function TermsScreen() {
  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Card className="w-full max-w-2xl mx-auto p-6 bg-card rounded-xl shadow-lg">
        <Text className="text-2xl font-bold text-center text-foreground mb-6">
          Terms and Conditions
        </Text>

        <Text className="text-base text-foreground mb-4">
          1. Service Provider Terms
        </Text>
        <Text className="text-sm text-muted-foreground mb-6">
          This instance of Kairos is operated by an independent service provider ("Host").
          The Host is responsible for:
          (a) maintaining and securing the server infrastructure,
          (b) ensuring compliance with applicable data protection laws,
          (c) managing user data responsibly and securely.
          Users acknowledge that their data is stored and managed by the Host, not the Kairos project developers.
        </Text>

        <Text className="text-base text-foreground mb-4">
          2. User Agreement
        </Text>
        <Text className="text-sm text-muted-foreground mb-6">
          By creating an account and using this service, you agree to:
          (a) provide accurate and complete registration information,
          (b) maintain the security of your account credentials,
          (c) use the service in compliance with applicable laws and regulations,
          (d) respect the privacy and rights of other users,
          (e) acknowledge that your data is stored on the Host's infrastructure.
        </Text>

        <Text className="text-base text-foreground mb-4">
          3. Data Privacy
        </Text>
        <Text className="text-sm text-muted-foreground mb-6">
          The Host will:
          (a) collect and process personal data in accordance with applicable privacy laws,
          (b) implement reasonable security measures to protect user data,
          (c) not share personal data with third parties without user consent or legal requirement.
          Users retain ownership of their data and may request its deletion at any time.
        </Text>

        <Text className="text-base text-foreground mb-4">
          4. Disclaimer
        </Text>
        <Text className="text-sm text-muted-foreground mb-6">
          This service is provided "as is" without warranties of any kind.
          Neither the Host nor the Kairos project developers shall be liable for any damages
          arising from the use of this service. The Host reserves the right to modify or
          terminate the service at any time. Users are advised to maintain backups of their important data.
        </Text>

        <Button
          onPress={() => router.back()}
          variant="ghost"
          className="mt-4"
        >
          <Text className="text-muted-foreground">Back</Text>
        </Button>
      </Card>
    </ScrollView>
  );
}
