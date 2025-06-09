
import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { menuItems } from './menuItems';

interface AdminSidebarMenuProps {
  activeSection: string;
  onSectionChange?: (section: string) => void;
  isCollapsed: boolean;
}

const AdminSidebarMenu = ({ activeSection, onSectionChange, isCollapsed }: AdminSidebarMenuProps) => {
  const handleSectionClick = (section: string) => {
    onSectionChange?.(section);
  };

  const renderSeparator = () => {
    return (
      <div className="py-2">
        <Separator className="bg-border/20 transition-colors duration-200" />
      </div>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className={cn(
          "space-y-1",
          isCollapsed && "flex flex-col items-center w-full"
        )}>
          {menuItems.map((item, index) => {
            const nextItem = menuItems[index + 1];
            const shouldShowSeparator = nextItem && item.category !== nextItem.category;
            
            return (
              <React.Fragment key={item.id}>
                <SidebarMenuItem 
                  className={cn(
                    "group/menu-item relative",
                    isCollapsed && "flex justify-center"
                  )}
                  style={{
                    animationDelay: `${index * 40}ms`,
                    animation: 'slideInLeft 0.3s ease-out forwards'
                  }}
                >
                  <SidebarMenuButton 
                    onClick={() => handleSectionClick(item.id)} 
                    isActive={activeSection === item.id} 
                    tooltip={isCollapsed ? item.label : undefined} 
                    className={cn(
                      "font-armenian h-12 rounded-xl transition-all duration-200 group relative overflow-hidden",
                      "hover:bg-sidebar-accent/80 hover:shadow-sm hover:scale-[1.01]",
                      "focus-visible:ring-2 focus-visible:ring-edu-blue/50 focus-visible:outline-none",
                      // Microsoft-style collapsed state - center icons
                      isCollapsed ? [
                        "px-0 justify-center w-12 mx-auto",
                        activeSection === item.id && "bg-edu-blue/10 border border-edu-blue/20 shadow-sm"
                      ] : [
                        "px-4 justify-start text-left",
                        activeSection === item.id && ["bg-edu-blue/10 border border-edu-blue/20 shadow-sm", "text-edu-blue font-medium"]
                      ]
                    )}
                  >
                    <item.icon className={cn(
                      "transition-all duration-200 group-hover:scale-105 flex-shrink-0",
                      isCollapsed ? [
                        "w-5 h-5",
                        activeSection === item.id ? "text-edu-blue" : "text-muted-foreground group-hover:text-foreground"
                      ] : [
                        "w-5 h-5 mr-3",
                        activeSection === item.id ? "text-edu-blue" : "text-muted-foreground group-hover:text-foreground"
                      ]
                    )} />
                    
                    <span className={cn(
                      "transition-all duration-200 flex-1 text-left leading-tight",
                      isCollapsed ? "sr-only" : [
                        "text-sm font-medium",
                        activeSection === item.id ? "text-edu-blue font-semibold" : "text-foreground/80 group-hover:text-foreground"
                      ]
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Improved badge positioning and sizing */}
                    {item.badge && (
                      <Badge 
                        variant={item.badge === 'Նոր' ? 'default' : 'secondary'} 
                        className={cn(
                          "text-xs transition-all duration-200 flex-shrink-0",
                          isCollapsed ? [
                            "absolute -top-1 -right-1 w-5 h-5 p-0 rounded-full flex items-center justify-center",
                            "transform scale-75",
                            item.badge === 'Նոր' && "bg-green-500 text-white border-0",
                            item.badge !== 'Նոր' && "bg-edu-blue text-white border-0"
                          ] : [
                            "ml-auto px-2 py-0.5 min-w-fit",
                            item.badge === 'Նոր' && "bg-green-500 text-white border-0",
                            item.badge !== 'Նոր' && "bg-edu-blue text-white border-0"
                          ]
                        )}
                      >
                        <span className={cn(
                          "whitespace-nowrap font-medium",
                          isCollapsed && item.badge !== 'Նոր' ? "text-xs" : "text-xs"
                        )}>
                          {isCollapsed && item.badge !== 'Նոր' ? item.badge.slice(0, 1) : item.badge}
                        </span>
                      </Badge>
                    )}

                    {/* Subtle hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {shouldShowSeparator && renderSeparator()}
              </React.Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default AdminSidebarMenu;
