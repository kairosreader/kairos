import { Platform } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./constants";

// Types and Interfaces
interface FlowNode {
  attributes: Record<string, any>;
  group: string;
  messages: Array<{ text: string }>;
  type: string;
}

interface FlowUI {
  nodes: FlowNode[];
  action: string;
  method: string;
}

interface FlowResponse {
  id: string;
  type: string;
  ui: FlowUI;
}

interface AuthError extends Error {
  code?: string;
  details?: Record<string, any>;
}

interface ContinueWithAction {
  action: string;
  flow?: { id: string };
  redirect_browser_to?: string;
}

// Constants
export const AUTH_ENDPOINTS = {
  LOGIN: "login",
  REGISTRATION: "registration",
  VERIFICATION: "verification",
  RECOVERY: "recovery",
  SETTINGS: "settings",
  LOGOUT: "logout",
  WHOAMI: "sessions/whoami",
} as const;

class AuthService {
  private sessionToken: string | null = null;
  private readonly logger = {
    debug: (message: string, ...args: any[]) =>
      console.log(`[Debug] ${message}`, ...args),
    error: (message: string, error: any) =>
      console.error(`[Error] ${message}:`, error),
  };

  // ===== Core Utilities =====
  private async getKratosUrl(): Promise<string> {
    try {
      if (Platform.OS === "web") {
        return `${window.location.origin}/auth`;
      }
      const serverUrl = await AsyncStorage.getItem(STORAGE_KEYS.SERVER_URL);
      if (!serverUrl) {
        throw this.createAuthError("Server URL not configured");
      }
      return `${serverUrl}/auth`;
    } catch (error) {
      throw this.createAuthError("Failed to get Kratos URL", error);
    }
  }

  private async getFetchOptions(
    options: RequestInit = {},
  ): Promise<RequestInit> {
    const baseHeaders = {
      "Content-Type": "application/json",
    };

    if (Platform.OS === "web") {
      return {
        ...options,
        credentials: "include",
        mode: "same-origin",
        headers: {
          Accept: "application/json",
          ...baseHeaders,
          ...options.headers,
        },
      };
    }

    const headers = { ...baseHeaders };
    await this.appendSessionToken(headers);

    return {
      ...options,
      headers: { ...headers, ...options.headers },
    };
  }

  private async appendSessionToken(
    headers: Record<string, string>,
  ): Promise<void> {
    if (Platform.OS === "web") return;

    if (!this.sessionToken) {
      this.sessionToken = await AsyncStorage.getItem(
        STORAGE_KEYS.SESSION_TOKEN,
      );
    }

    if (this.sessionToken) {
      headers["X-Session-Token"] = this.sessionToken;
    }
  }

  private createAuthError(message: string, originalError?: any): AuthError {
    const error = new Error(message) as AuthError;
    if (originalError) {
      error.details = { originalError };
    }
    return error;
  }

  private async getFlowEndpoint(flow: string): Promise<string> {
    const kratosUrl = await this.getKratosUrl();
    const endpoint =
      Platform.OS === "web"
        ? `${kratosUrl}/self-service/${flow}/browser`
        : `${kratosUrl}/self-service/${flow}/api`;
    this.logger.debug(`Getting flow endpoint for ${flow}:`, endpoint);
    return endpoint;
  }

  private extractCsrfToken(flow: FlowResponse): string | null {
    return (
      flow.ui.nodes?.find((node) => node.attributes?.name === "csrf_token")
        ?.attributes?.value || null
    );
  }

  private extractErrorMessage(data: any): string {
    // Check UI nodes for messages
    if (data.ui?.nodes) {
      for (const node of data.ui.nodes) {
        if (node.messages?.[0]?.text) {
          return this.formatErrorMessage(node.messages[0].text);
        }
      }
    }

    // Check error message
    if (data.error?.message) {
      return this.formatErrorMessage(data.error.message);
    }

    return "";
  }

  private formatErrorMessage(message: string): string {
    return message.includes("because:")
      ? message.split("because:")[1].trim()
      : message;
  }

  // ===== Flow Management =====
  async initializeFlow(
    flowType: keyof typeof AUTH_ENDPOINTS,
  ): Promise<FlowResponse> {
    try {
      const endpoint = await this.getFlowEndpoint(AUTH_ENDPOINTS[flowType]);
      this.logger.debug(`Initializing ${flowType} flow at:`, endpoint);

      const response = await fetch(endpoint, await this.getFetchOptions());

      if (!response.ok) {
        const text = await response.text();
        this.logger.error(`Failed to initialize ${flowType} flow`, text);
        throw this.createAuthError(`Failed to initialize ${flowType} flow`);
      }

      return response.json();
    } catch (error) {
      this.logger.error(`Error initializing ${flowType} flow`, error);
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
        await this.getFetchOptions(),
      );

      if (!flowResponse.ok) {
        const errorData = await flowResponse.json();
        throw this.createAuthError(
          errorData.error?.message || `Failed to get ${flowType} flow`,
        );
      }

      const flow: FlowResponse = await flowResponse.json();
      const csrfToken = this.extractCsrfToken(flow);

      this.logger.debug(`Submitting ${flowType} flow to:`, flow.ui.action);

      const response = await fetch(
        flow.ui.action,
        await this.getFetchOptions({
          method: flow.ui.method,
          body: JSON.stringify({
            ...values,
            csrf_token: csrfToken,
          }),
        }),
      );

      return response;
    } catch (error) {
      this.logger.error(`Error submitting ${flowType} flow`, error);
      throw error;
    }
  }

  private async handleAuthResponse(
    response: Response,
    flowType: string = "auth",
  ): Promise<any> {
    const data = await response.json();
    this.logger.debug(
      `${flowType} response data:`,
      JSON.stringify(data, null, 2),
    );

    if (!response.ok) {
      throw this.createAuthError(
        this.extractErrorMessage(data) || `${flowType} failed`,
      );
    }

    await this.handleSessionToken(response, data);
    return this.handleContinueWith(data, flowType);
  }

  private async handleSessionToken(
    response: Response,
    data: any,
  ): Promise<void> {
    if (Platform.OS === "web") return;

    const sessionToken =
      response.headers.get("X-Session-Token") || data.session_token;
    if (sessionToken) {
      this.logger.debug("Storing session token:", sessionToken);
      this.sessionToken = sessionToken;
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, sessionToken);
    }
  }

  private async handleContinueWith(data: any, flowType: string): Promise<any> {
    if (Platform.OS === "web" && data.continue_with?.length > 0) {
      const redirectAction = data.continue_with.find(
        (action: ContinueWithAction) => action.action === "redirect_browser_to",
      );
      const verificationAction = data.continue_with.find(
        (action: ContinueWithAction) =>
          action.action === "show_verification_ui",
      );

      if (redirectAction) {
        const redirectPath = redirectAction.redirect_browser_to;
        const flowId = verificationAction?.flow?.id;
        const queryParams = flowId ? `?flow=${flowId}` : "";
        window.location.href = redirectPath + queryParams;
        return null;
      }
    } else if (this.sessionToken && flowType === AUTH_ENDPOINTS.LOGIN) {
      router.replace("/(app)");
    }

    return data;
  }

  // ===== Public Authentication Methods =====
  async login(flowId: string, email: string, password: string): Promise<any> {
    const response = await this.submitFlow(AUTH_ENDPOINTS.LOGIN, flowId, {
      method: "password",
      password,
      identifier: email,
    });
    return this.handleAuthResponse(response, AUTH_ENDPOINTS.LOGIN);
  }

  async signup(
    flowId: string,
    email: string,
    password: string,
    name: string,
  ): Promise<any> {
    const response = await this.submitFlow(
      AUTH_ENDPOINTS.REGISTRATION,
      flowId,
      {
        method: "password",
        password,
        traits: { email, name },
      },
    );
    return this.handleAuthResponse(response, AUTH_ENDPOINTS.REGISTRATION);
  }

  async resetPassword(flowId: string, password: string): Promise<any> {
    const response = await this.submitFlow(AUTH_ENDPOINTS.SETTINGS, flowId, {
      method: "password",
      password,
    });
    return this.handleAuthResponse(response, AUTH_ENDPOINTS.SETTINGS);
  }

  async verifyEmail(flowId: string, values: Record<string, any>): Promise<any> {
    const response = await this.submitFlow(
      AUTH_ENDPOINTS.VERIFICATION,
      flowId,
      values,
    );

    if (response.ok) {
      const loginFlow = await this.initializeFlow("LOGIN");
      this.logger.debug("Initialized login flow:", loginFlow);

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
    const response = await this.submitFlow(
      AUTH_ENDPOINTS.RECOVERY,
      flowId,
      values,
    );
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

      const response = await fetch(
        `${kratosUrl}/${AUTH_ENDPOINTS.WHOAMI}`,
        await this.getFetchOptions({
          method: "GET",
          credentials: Platform.OS === "web" ? "include" : "omit",
        }),
      );

      if (!response.ok) {
        if (response.status === 401) {
          if (Platform.OS !== "web") {
            await this.clearSession();
          }
          throw this.createAuthError("No active session");
        }
        throw this.createAuthError(`Session check failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      this.logger.error("Error getting session", error);
      throw error;
    }
  }

  private async clearSession(): Promise<void> {
    this.sessionToken = null;
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  }

  async logout(): Promise<void> {
    try {
      const kratosUrl = await this.getKratosUrl();

      if (Platform.OS === "web") {
        const response = await fetch(
          `${kratosUrl}/self-service/${AUTH_ENDPOINTS.LOGOUT}/browser`,
          await this.getFetchOptions(),
        );

        if (!response.ok) {
          throw this.createAuthError("Failed to initialize logout");
        }

        const data = await response.json();
        window.location.href = data.logout_url;
      } else {
        const response = await fetch(
          `${kratosUrl}/self-service/${AUTH_ENDPOINTS.LOGOUT}/api`,
          await this.getFetchOptions({
            method: "DELETE",
            body: JSON.stringify({}),
          }),
        );

        if (!response.ok) {
          this.logger.error("Logout failed with status:", response.status);
          const text = await response.text();
          this.logger.error("Logout error:", text);
          throw this.createAuthError("Logout failed");
        }

        await this.clearSession();
        router.replace("/login");
      }
    } catch (error) {
      this.logger.error("Error during logout", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
