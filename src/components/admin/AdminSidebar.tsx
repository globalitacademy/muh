
import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import AdminSidebarHeader from './sidebar/AdminSidebarHeader';
import AdminSidebarMenu from './sidebar/AdminSidebarMenu';
import AdminSidebarFooter from './sidebar/AdminSidebarFooter';
import { AdminSidebarProps } from './sidebar/types';

const AdminSidebar = ({
  activeSection = 'overview',
  onSectionChange
}: AdminSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar 
      variant="inset" 
      className={cn(
        "border-r backdrop-blur-xl bg-gradient-to-br from-background/50 via-card/40 to-background/30",
        "shadow-2xl transition-all duration-300 ease-out",
        "border-border/20"
      )} 
      collapsible="icon"
      style={{
        '--sidebar-width': 'clamp(18rem, 20vw, 22rem)',
        '--sidebar-width-mobile': 'clamp(20rem, 85vw, 24rem)',
        '--sidebar-width-icon': 'clamp(3.5rem, 4vw, 4.5rem)'
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-edu-blue/5 via-transparent to-edu-purple/5 pointer-events-none" />
      
      <AdminSidebarHeader isCollapsed={isCollapsed} />

      <SidebarContent className={cn(
        "px-2 sm:px-3 py-3 sm:py-4 overflow-y-auto scrollbar-thin relative",
        isCollapsed && "flex flex-col items-center"
      )}>
        <AdminSidebarMenu 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isCollapsed={isCollapsed}
        />
      </SidebarContent>

      <AdminSidebarFooter isCollapsed={isCollapsed} />
    </Sidebar>
  );
};

export default AdminSidebar;
