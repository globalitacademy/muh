
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
      className="border-r border-border/30 backdrop-blur-sm bg-card/50 transition-all duration-150 ease-out" 
      collapsible="icon"
      style={{
        '--sidebar-width': '20rem',
        '--sidebar-width-mobile': '22rem',
        '--sidebar-width-icon': '4rem'
      } as React.CSSProperties}
    >
      <AdminSidebarHeader isCollapsed={isCollapsed} />

      <SidebarContent className={cn(
        "px-3 py-4 overflow-y-auto scrollbar-thin",
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
