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

  // ===== Core Utilities =====
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
    const csrfNode = flow.ui.nodes.find(
      (node) => node.attributes?.name === "csrf_token",
    );
    return csrfNode?.attributes?.value || null;
  }

  private extractErrorMessage(data: any): string {
    if (data.ui?.nodes) {
      for (const node of data.ui.nodes) {
        if (node.messages?.length > 0) {
          const message = node.messages[0].text;
          if (message.includes("because:")) {
            return message.split("because:")[1].trim();
          }
          return message;
        }
      }
    }

    if (data.error?.message) {
      const message = data.error.message;
      if (message.includes("because:")) {
        return message.split("because:")[1].trim();
      }
      return message;
    }

    return "";
  }

  // ===== Flow Initialization =====
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

  async initializeRecoveryFlow(): Promise<FlowResponse> {
    try {
      const endpoint = await this.getFlowEndpoint("recovery");
      const response = await fetch(endpoint, this.getFetchOptions());

      if (!response.ok) {
        throw new Error("Failed to initialize recovery flow");
      }

      return response.json();
    } catch (error) {
      console.error("Error initializing recovery flow:", error);
      throw error;
    }
  }

  async initializeSettingsFlow(): Promise<any> {
    const response = await fetch(
      `${await this.getKratosUrl()}/self-service/settings/flows`,
      {
        credentials: "include",
      },
    );
    return this.handleAuthResponse(response);
  }

  async getSettingsFlow(flowId: string): Promise<any> {
    const response = await fetch(
      `${await this.getKratosUrl()}/self-service/settings/flows?id=${flowId}`,
      {
        credentials: "include",
      },
    );
    return this.handleAuthResponse(response);
  }

  // ===== Flow Submission =====
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
        const errorData = await flowResponse.json();
        throw new Error(
          errorData.error?.message || `Failed to get ${flowType} flow`,
        );
      }

      const flow: FlowResponse = await flowResponse.json();
      const csrfToken = this.extractCsrfToken(flow);

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

      return response;
    } catch (error) {
      console.error(`Error submitting ${flowType} flow:`, error);
      throw error;
    }
  }

  private async handleAuthResponse(
    response: Response,
    flowType: string = "auth",
  ): Promise<any> {
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = this.extractErrorMessage(data);
      throw new Error(errorMessage || `${flowType} failed`);
    }

    const sessionToken = response.headers.get("X-Session-Token");

    if (data.session || sessionToken) {
      if (Platform.OS !== "web") {
        if (sessionToken) {
          this.sessionToken = sessionToken;
          await AsyncStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, sessionToken);
        } else if (data.session?.token) {
          this.sessionToken = data.session.token;
          await AsyncStorage.setItem(
            STORAGE_KEYS.SESSION_TOKEN,
            data.session.token,
          );
        }
      }
    }

    if (data.continue_with?.length > 0) {
      const redirectAction = data.continue_with.find(
        (action: any) => action.action === "redirect_browser_to",
      );
      const verificationAction = data.continue_with.find(
        (action: any) => action.action === "show_verification_ui",
      );

      if (redirectAction) {
        const redirectPath = redirectAction.redirect_browser_to;

        const flowId = verificationAction?.flow?.id;
        const queryParams = flowId ? `?flow=${flowId}` : "";

        if (Platform.OS === "web") {
          window.location.href = redirectPath + queryParams;
        } else {
          const path = redirectPath.replace(/^\//, "");
          const pathMap: Record<string, string> = {
            verify: "/(auth)/verify",
            login: "/(auth)/login",
            "": "/",
          };

          const mappedPath = pathMap[path] || "/";
          const finalPath = flowId
            ? `${mappedPath}?flow=${flowId}`
            : mappedPath;
          router.replace(finalPath as any);
        }
        return null;
      }
    }

    return data;
  }

  // ===== Authentication Methods =====
  async login(flowId: string, email: string, password: string): Promise<any> {
    const response = await this.submitFlow("login", flowId, {
      method: "password",
      password,
      identifier: email,
    });

    return this.handleAuthResponse(response, "login");
  }

  async signup(
    flowId: string,
    email: string,
    password: string,
    name: string,
  ): Promise<any> {
    const response = await this.submitFlow("registration", flowId, {
      method: "password",
      password,
      traits: {
        email,
        name,
      },
    });

    return this.handleAuthResponse(response, "registration");
  }

  async resetPassword(flowId: string, password: string): Promise<any> {
    const response = await this.submitFlow("settings", flowId, {
      method: "password",
      password,
    });

    const data = await response.json();
    if (!response.ok) {
      const errorMessage = this.extractErrorMessage(data);
      throw new Error(errorMessage || "Failed to update password");
    }
    return data;
  }

  async verifyEmail(flowId: string, values: Record<string, any>): Promise<any> {
    const response = await this.submitFlow("verification", flowId, values);

    if (response.ok) {
      const loginFlow = await this.initializeLoginFlow();
      console.log("Initialized login flow:", loginFlow);

      if (Platform.OS === "web") {
        window.location.href = loginFlow.ui.action;
      } else {
        router.replace("/(auth)/login");
      }
      return null;
    }

    return this.handleAuthResponse(response);
  }

  async requestPasswordReset(
    flowId: string,
    values: Record<string, any>,
  ): Promise<any> {
    const response = await this.submitFlow("recovery", flowId, values);
    return this.handleAuthResponse(response);
  }

  // ===== Session Management =====
  async getSession(): Promise<any> {
    try {
      const kratosUrl = await this.getKratosUrl();

      if (Platform.OS !== "web" && !this.sessionToken) {
        this.sessionToken = await AsyncStorage.getItem(
          STORAGE_KEYS.SESSION_TOKEN,
        );
      }

      const headers: Record<string, string> = {
        Accept: "application/json",
      };

      if (Platform.OS !== "web" && this.sessionToken) {
        headers["X-Session-Token"] = this.sessionToken;
      }

      const response = await fetch(`${kratosUrl}/sessions/whoami`, {
        method: "GET",
        credentials: Platform.OS === "web" ? "include" : "omit",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          if (Platform.OS !== "web") {
            this.sessionToken = null;
            await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
          }
          throw new Error("No active session");
        }
        throw new Error(`Session check failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting session:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const kratosUrl = await this.getKratosUrl();

      if (Platform.OS === "web") {
        const response = await fetch(
          `${kratosUrl}/self-service/logout/browser`,
          this.getFetchOptions(),
        );

        if (!response.ok) {
          throw new Error("Failed to initialize logout");
        }

        const data = await response.json();
        window.location.href = data.logout_url;
      } else {
        const response = await fetch(
          `${kratosUrl}/self-service/logout/api`,
          this.getFetchOptions(),
        );

        if (!response.ok) {
          throw new Error("Failed to initialize logout");
        }

        const data = await response.json();

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

        router.replace("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
