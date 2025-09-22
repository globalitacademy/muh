// Main thread scheduler to prevent Total Blocking Time issues
export class MainThreadScheduler {
  private static instance: MainThreadScheduler;
  private taskQueue: (() => void)[] = [];
  private isProcessing = false;
  private maxTaskTime = 5; // 5ms max per task to stay under 50ms blocking threshold

  static getInstance(): MainThreadScheduler {
    if (!MainThreadScheduler.instance) {
      MainThreadScheduler.instance = new MainThreadScheduler();
    }
    return MainThreadScheduler.instance;
  }

  // Schedule a task with automatic yielding
  schedule(task: () => void, priority: 'high' | 'normal' | 'low' = 'normal'): void {
    if (priority === 'high') {
      this.taskQueue.unshift(task);
    } else {
      this.taskQueue.push(task);
    }
    
    if (!this.isProcessing) {
      this.processTasks();
    }
  }

  // Process tasks in time-sliced manner
  private async processTasks(): Promise<void> {
    if (this.isProcessing || this.taskQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.taskQueue.length > 0) {
      const startTime = performance.now();
      let tasksProcessed = 0;
      
      // Process tasks for max 5ms to avoid blocking
      while (
        this.taskQueue.length > 0 && 
        performance.now() - startTime < this.maxTaskTime &&
        tasksProcessed < 10 // Process max 10 tasks per slice
      ) {
        const task = this.taskQueue.shift();
        if (task) {
          try {
            task();
            tasksProcessed++;
          } catch (error) {
            console.error('Task execution error:', error);
          }
        }
      }
      
      // Yield to main thread if more tasks remain
      if (this.taskQueue.length > 0) {
        await this.yieldToMainThread();
      }
    }
    
    this.isProcessing = false;
  }

  // Yield control back to main thread
  private yieldToMainThread(): Promise<void> {
    return new Promise(resolve => {
      if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
        (window as any).scheduler.postTask(resolve, { priority: 'background' });
      } else if ('MessageChannel' in window) {
        // Use MessageChannel for immediate yielding
        const channel = new MessageChannel();
        channel.port2.onmessage = () => resolve();
        channel.port1.postMessage(null);
      } else {
        setTimeout(resolve, 0);
      }
    });
  }

  // Break large operations into chunks
  async processLargeOperation<T>(
    items: T[],
    processor: (item: T) => void,
    chunkSize: number = 50
  ): Promise<void> {
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      
      this.schedule(() => {
        chunk.forEach(processor);
      });
      
      // Yield after scheduling each chunk
      await this.yieldToMainThread();
    }
  }

  // Get current queue length for monitoring
  getQueueLength(): number {
    return this.taskQueue.length;
  }

  // Clear all pending tasks
  clear(): void {
    this.taskQueue = [];
  }
}