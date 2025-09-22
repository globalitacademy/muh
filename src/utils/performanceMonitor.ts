// Performance monitoring utility to prevent main-thread blocking
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private frameCount = 0;
  private lastFpsUpdate = performance.now();
  private currentFps = 60;
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  // Check if device can handle high-performance animations
  shouldReduceAnimations(): boolean {
    // Reduce animations on low-end devices or when FPS drops below 30
    return this.currentFps < 30 || this.isLowEndDevice();
  }
  
  // Detect low-end devices
  private isLowEndDevice(): boolean {
    // Simple heuristic based on hardware concurrency and memory
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || 4;
    
    return cores < 4 || memory < 4;
  }
  
  // Update FPS tracking
  updateFrame(): void {
    this.frameCount++;
    const now = performance.now();
    
    if (now - this.lastFpsUpdate >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }
  
  // Get recommended frame interval based on performance
  getFrameInterval(): number {
    if (this.shouldReduceAnimations()) {
      return 33.33; // 30fps for low-end devices
    }
    return 16.67; // 60fps for capable devices
  }
}