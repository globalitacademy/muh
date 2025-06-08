
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, XCircle, Info, Clock } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  text,
  size = 'md',
  showIcon = true,
  className
}) => {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      className: 'status-success',
      bgClass: 'bg-success-green/10',
      textClass: 'text-success-green',
      borderClass: 'border-success-green/20'
    },
    warning: {
      icon: AlertCircle,
      className: 'status-warning',
      bgClass: 'bg-warning-yellow/10',
      textClass: 'text-warning-yellow',
      borderClass: 'border-warning-yellow/20'
    },
    error: {
      icon: XCircle,
      className: 'status-error',
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
      borderClass: 'border-destructive/20'
    },
    info: {
      icon: Info,
      className: 'status-info',
      bgClass: 'bg-edu-blue/10',
      textClass: 'text-edu-blue',
      borderClass: 'border-edu-blue/20'
    },
    pending: {
      icon: Clock,
      className: 'status-warning',
      bgClass: 'bg-muted/50',
      textClass: 'text-muted-foreground',
      borderClass: 'border-muted'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium transition-all duration-200',
        config.bgClass,
        config.textClass,
        config.borderClass,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={cn(iconSizes[size])} />}
      {text && <span className="font-armenian">{text}</span>}
    </div>
  );
};

export default StatusIndicator;
