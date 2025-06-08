
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  variant?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const EnhancedLoading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center gap-2', className)}>
        <Loader2 className={cn('animate-spin text-edu-blue', sizeClasses[size])} />
        {text && <span className="text-muted-foreground font-armenian">{text}</span>}
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="skeleton-pulse h-4 rounded w-3/4"></div>
        <div className="skeleton-pulse h-4 rounded w-1/2"></div>
        <div className="skeleton-pulse h-4 rounded w-2/3"></div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center gap-1', className)}>
        <div className="w-2 h-2 bg-edu-blue rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-edu-blue rounded-full animate-bounce animation-delay-200"></div>
        <div className="w-2 h-2 bg-edu-blue rounded-full animate-bounce animation-delay-400"></div>
        {text && <span className="ml-2 text-muted-foreground font-armenian">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className={cn('bg-edu-blue rounded-full animate-pulse-slow', sizeClasses[size])}></div>
        {text && <span className="ml-2 text-muted-foreground font-armenian">{text}</span>}
      </div>
    );
  }

  return null;
};

export default EnhancedLoading;
