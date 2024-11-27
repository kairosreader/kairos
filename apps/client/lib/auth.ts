import { Platform } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./constants";

interface FlowResponse {
  id: string;
  type: string;
  ui: {
    nodes: Array<{
      attributes: Record<string, any>;
      group: string;
      messages: Array<{ text: string }>;
      type: string;
    }>;
    action: string;
    method: string;
  };
}

class AuthService {
  private sessionToken: string | null = null;

  private async getKratosUrl(): Promise<string> {
    if (Platform.OS === "web") {
      return `${window.location.origin}/auth`;
    }
    const serverUrl = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_URL);
    if (!serverUrl) {
      throw new Error("Server URL not configured");
    }
    return `${serverUrl}/auth`;
  }

  private getFetchOptions(options: RequestInit = {}): RequestInit {
    return Platform.OS === "web"
      ? {
          ...options,
          credentials: "include",
          mode: "same-origin",
          headers: {
            ...{
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            ...options.headers,
          },
        }
      : {
          ...options,
          headers: {
            ...{
              "Content-Type": "application/json",
            },
            ...options.headers,
          },
        };
  }

  private async getFlowEndpoint(flow: string): Promise<string> {
    const kratosUrl = await this.getKratosUrl();
    return `${kratosUrl}/self-service/${flow}/browser`;
  }

  private extractCsrfToken(flow: FlowResponse): string | null {
    // Find the csrf_token input node
    const csrfNode = flow.ui.nodes.find(
      (node) => node.attributes?.name === "csrf_token",
    );
    return csrfNode?.attributes?.value || null;
  }

  async initializeLoginFlow(): Promise<FlowResponse> {
    try {
      const endpoint = await this.getFlowEndpoint("login");
      const response = await fetch(endpoint, this.getFetchOptions());

      if (!response.ok) {
        throw new Error("Failed to initialize login flow");
      }

      return response.json();
    } catch (error) {
      console.error("Error initializing login flow:", error);
      throw error;
    }
  }

  async initializeRegistrationFlow(): Promise<FlowResponse> {
    try {
      const endpoint = await this.getFlowEndpoint("registration");
      const response = await fetch(endpoint, this.getFetchOptions());

      if (!response.ok) {
        throw new Error("Failed to initialize registration flow");
      }

      const flow = await response.json();
      return flow;
    } catch (error) {
      console.error("Error initializing registration flow:", error);
      throw error;
    }
  }

  async initializeVerificationFlow(): Promise<any> {
    try {
      return await this.getFlowEndpoint("verification");
    } catch (error) {
      console.error("Error initializing verification flow:", error);
      throw error;
    }
  }

  async verifyEmail(code: string): Promise<any> {
    const flow = await this.initializeVerificationFlow();
    return this.submitVerificationFlow(flow.id, {
      method: "code",
      code,
    });
  }

  async submitLoginFlow(
    flowId: string,
    values: Record<string, any>,
  ): Promise<any> {
    const response = await this.submitFlow("login", flowId, values);
    return this.handleAuthResponse(response);
  }

  async submitRegistrationFlow(
    flowId: string,
    values: Record<string, any>,
  ): Promise<any> {
    const response = await this.submitFlow("registration", flowId, values);
    return this.handleAuthResponse(response);
  }

  async submitVerificationFlow(
    flowId: string,
    values: Record<string, any>,
  ): Promise<any> {
    const response = await this.submitFlow("verification", flowId, values);
    const data = await response.json();
    console.log('Verification response:', data);

    if (response.ok) {
      // After successful verification, initialize login flow
      const loginFlow = await this.initializeLoginFlow();
      console.log('Initialized login flow:', loginFlow);
      
      // Redirect to login
      if (Platform.OS === "web") {
        window.location.href = loginFlow.ui.action;
      } else {
        router.replace("/(auth)/login");
      }
      return null;
    }

    return this.handleAuthResponse(response);
  }

  private async handleAuthResponse(response: Response): Promise<any> {
    const data = await response.json();
    console.log('Auth response data:', data);

    // Extract session token from header
    const sessionToken = response.headers.get('X-Session-Token');
    console.log('Session token from header:', sessionToken);

    // Handle session data if present
    if (data.session || sessionToken) {
      if (Platform.OS !== "web") {
        // For mobile, store the session token
        if (sessionToken) {
          this.sessionToken = sessionToken;
          await AsyncStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, sessionToken);
          console.log('Stored session token:', sessionToken);
        } else if (data.session?.token) {
          this.sessionToken = data.session.token;
          await AsyncStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, data.session.token);
          console.log('Stored session token from data:', data.session.token);
        }
      }
      // For web, the cookie is automatically handled by the browser
    }

    // Handle redirection from continue_with array
    if (data.continue_with?.length > 0) {
      // Find redirect action and verification flow
      const redirectAction = data.continue_with.find(
        (action: any) => action.action === "redirect_browser_to"
      );
      const verificationAction = data.continue_with.find(
        (action: any) => action.action === "show_verification_ui"
      );

      if (redirectAction) {
        const redirectPath = redirectAction.redirect_browser_to;
        console.log('Redirecting to:', redirectPath);
        
        // If we have a verification flow, append its ID
        const flowId = verificationAction?.flow?.id;
        const queryParams = flowId ? `?flow=${flowId}` : '';
        
        if (Platform.OS === "web") {
          window.location.href = redirectPath + queryParams;
        } else {
          // For mobile, handle the path directly since it's already relative
          const path = redirectPath.replace(/^\//, ""); // Remove leading slash if present
          console.log('Mapped path:', path);
          
          // Map Kratos paths to app paths
          const pathMap: Record<string, string> = {
            "verify": "/(auth)/verify",
            "login": "/(auth)/login",
            "": "/",
          };

          const mappedPath = pathMap[path] || "/";
          const finalPath = flowId ? `${mappedPath}?flow=${flowId}` : mappedPath;
          console.log('Final mapped path:', finalPath);
          router.replace(finalPath as any);
        }
        return null;
      }
    }

    return data;
  }

  async getSession(): Promise<any> {
    try {
      const kratosUrl = await this.getKratosUrl();

      // Try to get session token from storage for mobile
      if (Platform.OS !== "web" && !this.sessionToken) {
        this.sessionToken = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
      }

      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      // Add session token for mobile if available
      if (Platform.OS !== "web" && this.sessionToken) {
        headers["X-Session-Token"] = this.sessionToken;
      }

      const response = await fetch(
        `${kratosUrl}/sessions/whoami`,
        {
          method: "GET",
          credentials: Platform.OS === "web" ? "include" : "omit",
          headers,
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Clear invalid session
          if (Platform.OS !== "web") {
            this.sessionToken = null;
            await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
          }
          throw new Error("No active session");
        }
        throw new Error(`Session check failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Session data:', data);
      return data;
    } catch (error) {
      console.error("Error getting session:", error);
      throw error;
    }
  }

  private async submitFlow(
    flowType: string,
    flowId: string,
    values: Record<string, any>,
  ): Promise<Response> {
    try {
      const kratosUrl = await this.getKratosUrl();
      const flowResponse = await fetch(
        `${kratosUrl}/self-service/${flowType}/flows?id=${flowId}`,
        this.getFetchOptions(),
      );

      if (!flowResponse.ok) {
        throw new Error(`Failed to get ${flowType} flow`);
      }

      const flow: FlowResponse = await flowResponse.json();
      const csrfToken = this.extractCsrfToken(flow);

      // Submit using the action URL from the flow
      const response = await fetch(
        flow.ui.action,
        this.getFetchOptions({
          method: flow.ui.method,
          body: JSON.stringify({
            ...values,
            csrf_token: csrfToken,
          }),
        }),
      );

      if (response.status === 422) {
        // Validation error
        return response;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `${flowType} failed`);
      }

      return response;
    } catch (error) {
      console.error(`Error submitting ${flowType} flow:`, error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const kratosUrl = await this.getKratosUrl();

      if (Platform.OS === "web") {
        // Browser flow uses /browser endpoint and handles redirects
        const response = await fetch(
          `${kratosUrl}/self-service/logout/browser`,
          this.getFetchOptions(),
        );

        if (!response.ok) {
          throw new Error("Failed to initialize logout");
        }

        const data = await response.json();
        // For web, follow the logout URL
        window.location.href = data.logout_url;
      } else {
        // API flow uses /api endpoint
        const response = await fetch(
          `${kratosUrl}/self-service/logout/api`,
          this.getFetchOptions(),
        );

        if (!response.ok) {
          throw new Error("Failed to initialize logout");
        }

        const data = await response.json();

        // For API flow, we need to make a second request with the logout token
        const logoutResponse = await fetch(
          `${kratosUrl}/self-service/logout`,
          this.getFetchOptions({
            method: "POST",
            body: JSON.stringify({ logout_token: data.logout_token }),
          }),
        );

        if (!logoutResponse.ok) {
          throw new Error("Logout failed");
        }

        // After successful logout, redirect to login
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
