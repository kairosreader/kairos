export interface QueueService {
  enqueue<T>(queueName: string, payload: T): Promise<void>;
  registerHandler<T>(queueName: string, handler: QueueHandler<T>): void;
  shutdown(): Promise<void>;
}

export interface QueueHandler<T> {
  handle(payload: T): Promise<void>;
}
