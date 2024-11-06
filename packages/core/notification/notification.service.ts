export interface NotificationService {
  send(
    userId: string,
    message: {
      title: string;
      body: string;
      data?: Record<string, unknown>;
    },
  ): Promise<void>;
}
