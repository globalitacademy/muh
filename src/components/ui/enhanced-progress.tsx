
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedProgressProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'gradient' | 'striped';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

const EnhancedProgress: React.FC<EnhancedProgressProps> = ({
  value,
  max = 100,
  className,
  variant = 'default',
  size = 'md',
  showLabel = true,
  label,
  animated = false
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const getBarClasses = () => {
    const baseClasses = 'h-full transition-all duration-500 ease-out rounded-full';
    
    switch (variant) {
      case 'gradient':
        return cn(baseClasses, 'bg-gradient-to-r from-edu-blue to-edu-purple');
      case 'striped':
        return cn(
          baseClasses, 
          'bg-edu-blue relative overflow-hidden',
          animated && 'bg-stripe-animated'
        );
      default:
        return cn(baseClasses, 'bg-edu-blue');
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium font-armenian text-foreground">
            {label || 'Առաջընթաց'}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={cn(
        'w-full bg-muted rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={getBarClasses()}
          style={{ width: `${percentage}%` }}
        >
          {variant === 'striped' && animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedProgress;
