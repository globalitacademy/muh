
import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Connection {
  from: Node;
  to: Node;
  opacity: number;
}

const NetworkAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('NetworkAnimation: Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('NetworkAnimation: Canvas context not found');
      return;
    }

    console.log('NetworkAnimation: Initializing animation');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(`NetworkAnimation: Canvas resized to ${canvas.width}x${canvas.height}`);
    };

    const createNodes = () => {
      const nodeCount = Math.max(50, Math.floor((canvas.width * canvas.height) / 12000));
      nodesRef.current = [];

      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
        });
      }
      console.log(`NetworkAnimation: Created ${nodeCount} nodes`);
    };

    const updateConnections = () => {
      connectionsRef.current = [];
      const maxDistance = 150;

      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeA = nodesRef.current[i];
          const nodeB = nodesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
          );

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.6;
            connectionsRef.current.push({
              from: nodeA,
              to: nodeB,
              opacity: opacity,
            });
          }
        }
      }
    };

    const updateNodes = () => {
      nodesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get CSS custom property for edu-blue color with fallback
      const computedStyle = getComputedStyle(document.documentElement);
      const eduBlueVar = computedStyle.getPropertyValue('--edu-blue').trim();
      
      // Fallback colors
      const fallbackBlue = '221.2 83.2% 53.3%';
      const eduBlueHsl = eduBlueVar || fallbackBlue;
      
      // Create color strings
      const nodeColor = `hsla(${eduBlueHsl}, 0.8)`;
      const connectionColor = `hsla(${eduBlueHsl}, 0.4)`;

      // Draw connections
      connectionsRef.current.forEach((connection) => {
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.strokeStyle = `hsla(${eduBlueHsl}, ${connection.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
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
      console.log('NetworkAnimation: Cleanup completed');
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.7 }}
    />
  );
};

export default NetworkAnimation;
