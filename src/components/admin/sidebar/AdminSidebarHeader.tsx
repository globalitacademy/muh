
import React from 'react';
import { SidebarHeader } from '@/components/ui/sidebar';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarHeaderProps {
  isCollapsed: boolean;
}

const AdminSidebarHeader = ({ isCollapsed }: AdminSidebarHeaderProps) => {
  return (
    <SidebarHeader className="border-b border-border/20 p-6 bg-card/80 backdrop-blur-md relative overflow-hidden">
      {/* Clean minimal background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-accent/5" />
      
      {/* Main header content container */}
      <div className="relative z-10 flex items-center">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <div className={cn(
              "p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl shadow-sm transition-all duration-200 hover:shadow-md",
              isCollapsed && "p-2"
            )}>
              <Shield className={cn(
                "w-6 h-6 text-white transition-all duration-200",
                isCollapsed && "w-4 h-4"
              )} />
            </div>
          </div>
          
          <div className={cn(
            "flex-1 transition-all duration-200",
            isCollapsed && "hidden"
          )}>
            <h2 className="font-bold text-xl font-armenian text-foreground">
              Ադմին վահանակ
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground font-armenian">
                Կառավարման համակարգ
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarHeader>
  );
};

export default AdminSidebarHeader;
