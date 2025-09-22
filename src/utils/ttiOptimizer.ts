// Time to Interactive (TTI) optimization utility
export class TTIOptimizer {
  private static instance: TTIOptimizer;
  private isInteractive = false;
  private interactiveCallbacks: (() => void)[] = [];
  private performanceObserver: PerformanceObserver | null = null;
  
  static getInstance(): TTIOptimizer {
    if (!TTIOptimizer.instance) {
      TTIOptimizer.instance = new TTIOptimizer();
    }
    return TTIOptimizer.instance;
  }
  
  constructor() {
    this.initializeInteractivityDetection();
  }
  
  private initializeInteractivityDetection() {
    // Monitor for TTI conditions
    const checkInteractivity = () => {
      // Simple TTI heuristic: DOM loaded + no long tasks for 5s
      if (document.readyState === 'complete' && !this.hasRecentLongTasks()) {
        this.markAsInteractive();
      }
    };
    
    // Start checking after DOM is ready
    if (document.readyState === 'complete') {
      setTimeout(checkInteractivity, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(checkInteractivity, 1000);
      });
    }
    
    // Monitor long tasks if supported
    if ('PerformanceObserver' in window) {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.duration > 50) {
              console.warn('Long task detected:', entry.duration + 'ms');
            }
          });
        });
        this.performanceObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('PerformanceObserver not supported for long tasks');
      }
    }
  }
  
  private hasRecentLongTasks(): boolean {
    // Simple check - in a real implementation, you'd track recent long tasks
    return false;
  }
  
  private markAsInteractive() {
    if (!this.isInteractive) {
      this.isInteractive = true;
      console.log('Page marked as interactive');
      
      // Execute queued callbacks
      this.interactiveCallbacks.forEach(callback => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(callback);
        } else {
          setTimeout(callback, 0);
        }
      });
      this.interactiveCallbacks = [];
    }
  }
  
  // Queue operations until page is interactive
  whenInteractive(callback: () => void) {
    if (this.isInteractive) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback);
      } else {
        setTimeout(callback, 0);
      }
    } else {
      this.interactiveCallbacks.push(callback);
    }
  }
  
  // Check if page is ready for heavy operations
  isReadyForHeavyWork(): boolean {
    return this.isInteractive && this.getMainThreadPressure() < 0.8;
  }
  
  // Simple main thread pressure detection
  private getMainThreadPressure(): number {
    // Simplified heuristic - measure time for a small operation
    const start = performance.now();
    let iterations = 0;
    const maxTime = 5; // 5ms budget
    
    while (performance.now() - start < maxTime && iterations < 10000) {
      iterations++;
    }
    
    // If we couldn't complete many iterations, main thread is busy
    return iterations < 5000 ? 0.9 : 0.1;
  }
  
  // Break up heavy operations into chunks
  yieldToMainThread(): Promise<void> {
    return new Promise(resolve => {
      if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
        (window as any).scheduler.postTask(resolve, { priority: 'background' });
      } else if ('requestIdleCallback' in window) {
        requestIdleCallback(() => resolve(), { timeout: 5 });
      } else {
        setTimeout(resolve, 0);
      }
    });
  }

  // Process array in chunks to avoid blocking main thread
  async processInChunks<T, R>(
    array: T[],
    processor: (item: T, index: number) => R,
    chunkSize: number = 10
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      const chunkResults = chunk.map((item, idx) => processor(item, i + idx));
      results.push(...chunkResults);
      
      // Yield to main thread after each chunk
      if (i + chunkSize < array.length) {
        await this.yieldToMainThread();
      }
    }
    
    return results;
  }

  // Time-sliced execution for heavy operations
  async executeWithTimeSlicing<T>(
    operation: () => T,
    maxTime: number = 5
  ): Promise<T> {
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const execute = () => {
        try {
          const result = operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (performance.now() - startTime > maxTime) {
        // Yield and reschedule
        this.yieldToMainThread().then(execute);
      } else {
        execute();
      }
    });
  }
  
  cleanup() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}