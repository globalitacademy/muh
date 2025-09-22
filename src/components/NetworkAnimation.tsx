
import React, { useEffect, useRef } from 'react';
import { PerformanceMonitor } from '@/utils/performanceMonitor';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  pulse: number;
  pulseDirection: number;
}

interface Connection {
  from: Node;
  to: Node;
  opacity: number;
  strength: number;
}

const NetworkAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('NetworkAnimation: Design-integrated animation initializing');

    // Cache parent rect to avoid forced reflows
    let cachedParentRect: DOMRect | null = null;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      // Use cached rect or get fresh one if not available
      if (!cachedParentRect) {
        cachedParentRect = parent.getBoundingClientRect();
      }
      
      canvas.width = cachedParentRect.width;
      canvas.height = cachedParentRect.height;
      
      console.log(`NetworkAnimation: Canvas resized to ${canvas.width}x${canvas.height}`);
    };

    const createNodes = () => {
      const isMobile = window.innerWidth < 768;
      const baseNodeCount = isMobile ? 12 : 25;
      const nodeCount = Math.max(baseNodeCount, Math.floor((canvas.width * canvas.height) / 30000));
      nodesRef.current = [];

      const padding = 80;
      const maxX = Math.max(canvas.width - padding, 200);
      const maxY = Math.max(canvas.height - padding, 200);

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: padding + Math.random() * maxX,
          y: padding + Math.random() * maxY,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: 1.2 + Math.random() * 1.8,
          pulse: Math.random() * Math.PI * 2,
          pulseDirection: 1
        });
      }
      console.log(`NetworkAnimation: Created ${nodeCount} design-integrated nodes`);
    };

    const updateConnections = () => {
      connectionsRef.current = [];
      const maxDistance = window.innerWidth < 768 ? 120 : 180;

      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeA = nodesRef.current[i];
          const nodeB = nodesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
          );

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15;
            const strength = (1 - distance / maxDistance);
            connectionsRef.current.push({
              from: nodeA,
              to: nodeB,
              opacity: opacity,
              strength: strength
            });
          }
        }
      }
    };

    const updateNodes = () => {
      timeRef.current += 0.015;

      nodesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        const padding = 60;
        const maxX = canvas.width - padding;
        const maxY = canvas.height - padding;

        if (node.x < padding || node.x > maxX) {
          node.vx *= -1;
          node.x = Math.max(padding, Math.min(maxX, node.x));
        }
        if (node.y < padding || node.y > maxY) {
          node.vy *= -1;
          node.y = Math.max(padding, Math.min(maxY, node.y));
        }

        node.pulse += 0.015;
        if (node.pulse > Math.PI * 2) {
          node.pulse = 0;
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections with edu-blue to purple gradient
      connectionsRef.current.forEach((connection) => {
        const gradient = ctx.createLinearGradient(
          connection.from.x, connection.from.y, 
          connection.to.x, connection.to.y
        );
        // Using edu-blue (#3b82f6) to purple (#8b5cf6) gradient
        gradient.addColorStop(0, `hsla(221, 83%, 53%, ${connection.opacity})`);
        gradient.addColorStop(0.5, `hsla(262, 83%, 58%, ${connection.opacity * 0.7})`);
        gradient.addColorStop(1, `hsla(221, 83%, 53%, ${connection.opacity})`);
        
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.6 + connection.strength * 0.3;
        ctx.stroke();
      });

      // Draw nodes with brand colors
      nodesRef.current.forEach((node) => {
        const pulseSize = node.size + Math.sin(node.pulse) * 0.4;
        const pulseOpacity = 0.6 + Math.sin(node.pulse) * 0.3;

        // Main node with edu-blue gradient
        const nodeGradient = ctx.createRadialGradient(
          node.x - pulseSize * 0.3, node.y - pulseSize * 0.3, 0,
          node.x, node.y, pulseSize
        );
        nodeGradient.addColorStop(0, `hsla(221, 83%, 68%, ${pulseOpacity})`);
        nodeGradient.addColorStop(1, `hsla(221, 83%, 48%, ${pulseOpacity * 0.8})`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeGradient;
        ctx.fill();

        // Inner glow effect
        if (Math.sin(node.pulse) > 0.7) {
          const glowGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, pulseSize * 1.5
          );
          glowGradient.addColorStop(0, `hsla(262, 83%, 58%, ${pulseOpacity * 0.3})`);
          glowGradient.addColorStop(1, `hsla(262, 83%, 58%, 0)`);

          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }
      });
    };

    const animate = () => {
      // Performance safeguard: adaptive frame rate based on device capabilities
      const perfMonitor = PerformanceMonitor.getInstance();
      const frameInterval = perfMonitor.getFrameInterval();
      
      const now = performance.now();
      if (now - timeRef.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      timeRef.current = now;
      
      // Update performance metrics
      perfMonitor.updateFrame();
      
      // Reduce animation complexity on low-end devices
      if (!perfMonitor.shouldReduceAnimations()) {
        updateNodes();
        updateConnections();
      } else {
        // Simplified animation for performance
        updateNodes();
        if (Math.random() > 0.5) updateConnections(); // Skip some connection updates
      }
      
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Clear cached rect on resize and recalculate
        cachedParentRect = null;
        
        // Use requestAnimationFrame to batch DOM reads and writes
        requestAnimationFrame(() => {
          resizeCanvas();
          createNodes();
        });
      }, 250);
    };

    resizeCanvas();
    createNodes();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ 
        zIndex: 1, 
        opacity: 0.4,
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default NetworkAnimation;
