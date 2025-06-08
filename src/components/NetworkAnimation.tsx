
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
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('NetworkAnimation: Enhanced animation initializing');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(`NetworkAnimation: Canvas resized to ${canvas.width}x${canvas.height}`);
    };

    const createNodes = () => {
      const nodeCount = Math.max(35, Math.floor((canvas.width * canvas.height) / 15000));
      nodesRef.current = [];

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: 2 + Math.random() * 3,
          pulse: Math.random() * Math.PI * 2,
          pulseDirection: 1
        });
      }
      console.log(`NetworkAnimation: Created ${nodeCount} enhanced nodes`);
    };

    const updateConnections = () => {
      connectionsRef.current = [];
      const maxDistance = 180;

      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeA = nodesRef.current[i];
          const nodeB = nodesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
          );

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.4;
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

        // Bounce off edges with padding
        const padding = 50;
        if (node.x < padding || node.x > canvas.width - padding) {
          node.vx *= -1;
          node.x = Math.max(padding, Math.min(canvas.width - padding, node.x));
        }
        if (node.y < padding || node.y > canvas.height - padding) {
          node.vy *= -1;
          node.y = Math.max(padding, Math.min(canvas.height - padding, node.y));
        }

        // Update pulse animation
        node.pulse += 0.03;
        if (node.pulse > Math.PI * 2) {
          node.pulse = 0;
        }
      });
    };

    const draw = () => {
      // Clear canvas with subtle fade effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        ctx.lineWidth = 1 + connection.strength * 0.5;
        ctx.stroke();

        // Add subtle glow effect for stronger connections
        if (connection.strength > 0.7) {
          ctx.beginPath();
          ctx.moveTo(connection.from.x, connection.from.y);
          ctx.lineTo(connection.to.x, connection.to.y);
          ctx.strokeStyle = `hsla(221, 83%, 53%, ${connection.opacity * 0.3})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });

      // Draw enhanced nodes with pulse effect
      nodesRef.current.forEach((node) => {
        const pulseSize = node.size + Math.sin(node.pulse) * 0.8;
        const pulseOpacity = 0.8 + Math.sin(node.pulse) * 0.2;

        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, pulseSize * 2
        );
        glowGradient.addColorStop(0, `hsla(221, 83%, 53%, ${pulseOpacity * 0.3})`);
        glowGradient.addColorStop(1, 'hsla(221, 83%, 53%, 0)');

        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

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

    resizeCanvas();
    createNodes();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createNodes();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      console.log('NetworkAnimation: Enhanced cleanup completed');
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        zIndex: 1, 
        opacity: 0.6,
        mixBlendMode: 'normal'
      }}
    />
  );
};

export default NetworkAnimation;
