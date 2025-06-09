
import React from 'react';
import { SidebarFooter } from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarFooterProps {
  isCollapsed: boolean;
}

const AdminSidebarFooter = ({ isCollapsed }: AdminSidebarFooterProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarFooter className="border-t border-border/20 p-3 bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20 backdrop-blur-sm relative overflow-hidden">
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-edu-blue/5 via-transparent to-edu-purple/5" />
      
      <div className="flex items-center justify-center relative z-10">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          onClick={toggleSidebar}
          className={cn(
            "transition-all duration-300 hover:scale-105 rounded-xl group overflow-hidden relative",
            isCollapsed ? [
              "w-10 h-10 p-0",
              "bg-gradient-to-r from-edu-blue/10 to-edu-blue/20 hover:from-edu-blue/20 hover:to-edu-blue/30",
              "border border-edu-blue/20 hover:border-edu-blue/40 shadow-lg hover:shadow-xl",
              "backdrop-blur-sm"
            ] : [
              "w-full px-4 py-2 gap-2",
              "bg-gradient-to-r from-background/80 to-background/60 hover:from-accent/80 hover:to-accent/60",
              "border border-border/30 hover:border-edu-blue/30 shadow-md hover:shadow-lg",
              "backdrop-blur-sm"
            ]
          )}
        >
          {/* Background shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          
          {isCollapsed ? (
            <PanelRight className="h-4 w-4 text-edu-blue transition-all duration-200 group-hover:scale-110 relative z-10" />
          ) : (
            <>
              <PanelLeft className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:scale-110 group-hover:text-foreground relative z-10" />
              <span className="text-sm font-armenian text-muted-foreground group-hover:text-foreground transition-colors duration-200 relative z-10">
                Փակել մենյուն
              </span>
            </>
          )}
        </Button>
      </div>
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-edu-blue/20 to-transparent" />
    </SidebarFooter>
  );
};

export default AdminSidebarFooter;
