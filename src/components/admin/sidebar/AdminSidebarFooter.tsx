
import React from 'react';
import { SidebarFooter } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface AdminSidebarFooterProps {
  isCollapsed: boolean;
}

const AdminSidebarFooter = ({ isCollapsed }: AdminSidebarFooterProps) => {
  return (
    <SidebarFooter className="border-t border-border/20 p-4 bg-muted/30 backdrop-blur-sm">
      <div className={cn(
        "text-xs text-muted-foreground font-armenian text-center py-2 transition-all duration-200",
        isCollapsed && "hidden"
      )}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-2 h-2 bg-edu-blue rounded-full opacity-60"></div>
          <span className="text-xs leading-tight">Վարկան 2024</span>
        </div>
        <div className="text-xs opacity-60 leading-tight">
          Ուսումնական հարթակ
        </div>
        <div className="text-xs opacity-50 mt-1 leading-tight">
          {new Date().toLocaleDateString('hy-AM')}
        </div>
      </div>
      <div className={cn("hidden", isCollapsed && "block flex justify-center")}>
        <div className="w-2 h-2 bg-edu-blue rounded-full opacity-60"></div>
      </div>
    </SidebarFooter>
  );
};

export default AdminSidebarFooter;
