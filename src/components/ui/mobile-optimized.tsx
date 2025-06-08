
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedProps {
  children: React.ReactNode;
  className?: string;
  touchTarget?: boolean;
  reducedMotion?: boolean;
}

const MobileOptimized: React.FC<MobileOptimizedProps> = ({
  children,
  className,
  touchTarget = false,
  reducedMotion = false
}) => {
  return (
    <div
      className={cn(
        // Base mobile optimizations
        'w-full',
        // Touch target optimization
        touchTarget && 'min-h-[44px] min-w-[44px]',
        // Reduced motion support
        reducedMotion && 'motion-safe:animate-none',
        className
      )}
    >
      {children}
    </div>
  );
};

export default MobileOptimized;
