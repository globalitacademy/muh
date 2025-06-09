
import React from 'react';
import { SidebarHeader } from '@/components/ui/sidebar';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarHeaderProps {
  isCollapsed: boolean;
}

const AdminSidebarHeader = ({ isCollapsed }: AdminSidebarHeaderProps) => {
  return (
    <SidebarHeader className="border-b border-border/20 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-card/80 via-background/60 to-card/80 backdrop-blur-md relative overflow-hidden">
      {/* Enhanced background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/10 via-transparent to-edu-orange/10 animate-blob" />
      <div className="absolute inset-0 bg-gradient-to-tl from-edu-purple/5 via-transparent to-edu-light-blue/5 animate-blob animation-delay-2000" />
      
      {/* Main header content container */}
      <div className="relative z-10 flex items-center">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1">
          <div className="relative group">
            <div className={cn(
              "p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-edu-blue via-edu-blue to-edu-orange rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl group-hover:scale-105",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-1000 hover:before:translate-x-[100%] before:rounded-xl",
              isCollapsed && "p-1.5 sm:p-2"
            )}>
              <Shield className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white transition-all duration-200 relative z-10",
                isCollapsed && "w-3 h-3 sm:w-4 sm:h-4"
              )} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
          </div>
          
          <div className={cn(
            "flex-1 transition-all duration-200",
            isCollapsed && "hidden"
          )}>
            <h2 className="font-bold text-sm sm:text-lg md:text-xl font-armenian text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Ադմին վահանակ
            </h2>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
              <p className="text-xs sm:text-sm text-muted-foreground font-armenian">
                Կառավարման համակարգ
              </p>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-edu-blue/30 to-transparent" />
    </SidebarHeader>
  );
};

export default AdminSidebarHeader;
