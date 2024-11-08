import * as Bull from "bullmq";
import type { QueueHandler, QueueService } from "@kairos/core/queue";

export interface BullQueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
  };
}

export class BullQueueService implements QueueService {
  private queues: Map<string, Bull.Queue>;
  private workers: Map<string, Bull.Worker>;

  constructor(private config: BullQueueConfig) {
    this.queues = new Map();
    this.workers = new Map();
  }

  async enqueue<T>(queueName: string, payload: T): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.add(queueName, payload);
  }

  registerHandler<T>(queueName: string, handler: QueueHandler<T>): void {
    const worker = new Bull.Worker<T>(
      queueName,
      async (job: Bull.Job) => {
        try {
          await handler.handle(job.data);
        } catch (error) {
          console.error(
            `Error processing job ${job.id} in queue ${queueName}:`,
            error,
          );
          throw error;
        }
      },
      {
        connection: this.config.redis,
      },
    );

    this.workers.set(queueName, worker);

    worker.on("completed", (job) => {
      console.log(`Job ${job.id} completed in queue ${queueName}`);
    });

    worker.on("failed", (job, error) => {
      console.error(`Job ${job?.id} failed in queue ${queueName}:`, error);
    });
  }

  private getQueue(queueName: string): Bull.Queue {
    let queue = this.queues.get(queueName);
    if (!queue) {
      queue = new Bull.Queue(queueName, {
        connection: this.config.redis,
      });
      this.queues.set(queueName, queue);
    }
    return queue;
  }

  async shutdown(): Promise<void> {
    for (const [name, worker] of this.workers) {
      console.log(`Closing worker for queue ${name}`);
      await worker.close();
    }

    for (const [name, queue] of this.queues) {
      console.log(`Closing queue ${name}`);
      await queue.close();
    }
  }
}
