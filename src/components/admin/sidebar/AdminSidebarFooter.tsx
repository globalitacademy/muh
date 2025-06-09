
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
    <SidebarFooter className="border-t border-border/20 p-3 bg-muted/30 backdrop-blur-sm">
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          onClick={toggleSidebar}
          className={cn(
            "transition-all duration-200 hover:bg-accent/80 rounded-lg",
            isCollapsed ? [
              "w-10 h-10 p-0",
              "bg-edu-blue/10 hover:bg-edu-blue/20 border border-edu-blue/20"
            ] : [
              "w-full px-4 py-2 gap-2",
              "bg-background/80 hover:bg-accent border border-border/30"
            ]
          )}
        >
          {isCollapsed ? (
            <PanelRight className="h-4 w-4 text-edu-blue" />
          ) : (
            <>
              <PanelLeft className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-armenian text-muted-foreground">
                Փակել մենյուն
              </span>
            </>
          )}
        </Button>
      </div>
    </SidebarFooter>
  );
};

export default AdminSidebarFooter;
