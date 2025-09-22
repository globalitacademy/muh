
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  once?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  threshold = 0.1,
  direction = 'up',
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestIdleCallback to break up long tasks and improve FID
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              setTimeout(() => {
                setIsVisible(true);
              }, delay);
            });
          } else {
            // Fallback for browsers without requestIdleCallback
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
          
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold, once]);

  const getInitialStyles = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-8 opacity-0';
      case 'down':
        return '-translate-y-8 opacity-0';
      case 'left':
        return 'translate-x-8 opacity-0';
      case 'right':
        return '-translate-x-8 opacity-0';
      case 'scale':
        return 'scale-95 opacity-0';
      default:
        return 'translate-y-8 opacity-0';
    }
  };

  const getVisibleStyles = () => {
    return 'translate-y-0 translate-x-0 scale-100 opacity-100';
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? getVisibleStyles() : getInitialStyles(),
        className
      )}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
