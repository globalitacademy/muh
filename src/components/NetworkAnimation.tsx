import React, { useEffect, useRef } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('NetworkAnimation: Enhanced animation initializing with overflow protection');

    const resizeCanvas = () => {
      // Use container dimensions instead of window dimensions to prevent overflow
      const containerRect = container.getBoundingClientRect();
      canvas.width = Math.min(containerRect.width, window.innerWidth);
      canvas.height = Math.min(containerRect.height, window.innerHeight);
      
      // Ensure canvas doesn't exceed viewport
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      console.log(`NetworkAnimation: Canvas resized to ${canvas.width}x${canvas.height} (container constrained)`);
    };

    const createNodes = () => {
      // Reduce node count on mobile for better performance
      const isMobile = window.innerWidth < 768;
      const baseNodeCount = isMobile ? 20 : 35;
      const nodeCount = Math.max(baseNodeCount, Math.floor((canvas.width * canvas.height) / 20000));
      nodesRef.current = [];

      // Add padding to keep nodes within visible area
      const padding = 100;
      const maxX = Math.max(canvas.width - padding, 200);
      const maxY = Math.max(canvas.height - padding, 200);

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: padding + Math.random() * maxX,
          y: padding + Math.random() * maxY,
          vx: (Math.random() - 0.5) * 0.4, // Reduced speed for mobile
          vy: (Math.random() - 0.5) * 0.4,
          size: 2 + Math.random() * 2, // Smaller nodes on mobile
          pulse: Math.random() * Math.PI * 2,
          pulseDirection: 1
        });
      }
      console.log(`NetworkAnimation: Created ${nodeCount} constrained nodes`);
    };

    const updateConnections = () => {
      connectionsRef.current = [];
      const maxDistance = window.innerWidth < 768 ? 120 : 180; // Shorter connections on mobile

      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeA = nodesRef.current[i];
          const nodeB = nodesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
          );

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3; // Reduced opacity
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
      timeRef.current += 0.02;

      nodesRef.current.forEach((node) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Enhanced boundary constraints with proper padding
        const padding = 80;
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

        // Update pulse animation
        node.pulse += 0.02; // Slower pulse for mobile
        if (node.pulse > Math.PI * 2) {
          node.pulse = 0;
        }
      });
    };

    const draw = () => {
      // Clear canvas properly
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Enhanced gradient for connections
      const createGradient = (from: Node, to: Node, opacity: number) => {
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, `hsla(221, 83%, 53%, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(262, 83%, 58%, ${opacity * 0.8})`);
        gradient.addColorStop(1, `hsla(221, 83%, 53%, ${opacity})`);
        return gradient;
      };

      // Draw enhanced connections with gradients
      connectionsRef.current.forEach((connection) => {
        const gradient = createGradient(connection.from, connection.to, connection.opacity);
        
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + connection.strength * 0.3; // Thinner lines on mobile
        ctx.stroke();

        // Reduced glow effect for mobile performance
        if (connection.strength > 0.8 && window.innerWidth >= 768) {
          ctx.beginPath();
          ctx.moveTo(connection.from.x, connection.from.y);
          ctx.lineTo(connection.to.x, connection.to.y);
          ctx.strokeStyle = `hsla(221, 83%, 53%, ${connection.opacity * 0.2})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw enhanced nodes with pulse effect
      nodesRef.current.forEach((node) => {
        const pulseSize = node.size + Math.sin(node.pulse) * 0.6;
        const pulseOpacity = 0.7 + Math.sin(node.pulse) * 0.2;

        // Simplified glow for mobile
        if (window.innerWidth >= 768) {
          const glowGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, pulseSize * 1.5
          );
          glowGradient.addColorStop(0, `hsla(221, 83%, 53%, ${pulseOpacity * 0.3})`);
          glowGradient.addColorStop(1, 'hsla(221, 83%, 53%, 0)');

          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }

        // Main node with gradient
        const nodeGradient = ctx.createRadialGradient(
          node.x - pulseSize * 0.3, node.y - pulseSize * 0.3, 0,
          node.x, node.y, pulseSize
        );
        nodeGradient.addColorStop(0, `hsla(221, 83%, 63%, ${pulseOpacity})`);
        nodeGradient.addColorStop(1, `hsla(221, 83%, 43%, ${pulseOpacity})`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeGradient;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(node.x - pulseSize * 0.2, node.y - pulseSize * 0.2, pulseSize * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(221, 83%, 80%, ${pulseOpacity * 0.6})`;
        ctx.fill();
      });
    };

    const animate = () => {
      updateNodes();
      updateConnections();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Throttled resize handler for better performance
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createNodes();
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
      console.log('NetworkAnimation: Enhanced cleanup completed with overflow protection');
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden animation-container"
      style={{ zIndex: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
        style={{ 
          zIndex: 1, 
          opacity: 0.6,
          mixBlendMode: 'normal',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      />
    </div>
  );
};

export default NetworkAnimation;
