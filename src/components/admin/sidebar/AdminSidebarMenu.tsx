
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
      <div className="py-1.5 sm:py-2">
        <Separator className="bg-gradient-to-r from-transparent via-border/30 to-transparent transition-colors duration-200" />
      </div>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className={cn(
          "space-y-1.5 sm:space-y-2",
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
                    animationDelay: `${index * 50}ms`,
                    animation: 'fade-in 0.5s ease-out forwards'
                  }}
                >
                  <SidebarMenuButton 
                    onClick={() => handleSectionClick(item.id)} 
                    isActive={activeSection === item.id} 
                    tooltip={isCollapsed ? item.label : undefined} 
                    className={cn(
                      "font-armenian h-10 sm:h-11 md:h-12 rounded-xl transition-all duration-300 group relative overflow-hidden",
                      "hover:bg-gradient-to-r hover:from-sidebar-accent/50 hover:via-sidebar-accent/80 hover:to-sidebar-accent/50",
                      "hover:shadow-lg hover:scale-[1.02] hover:backdrop-blur-sm",
                      "focus-visible:ring-2 focus-visible:ring-edu-blue/50 focus-visible:outline-none",
                      // Enhanced collapsed state styling
                      isCollapsed ? [
                        "px-0 justify-center w-10 sm:w-11 md:w-12 mx-auto backdrop-blur-sm",
                        activeSection === item.id && [
                          "bg-gradient-to-r from-edu-blue/20 via-edu-blue/30 to-edu-blue/20",
                          "border border-edu-blue/30 shadow-lg shadow-edu-blue/20"
                        ]
                      ] : [
                        "px-2 sm:px-3 md:px-4 justify-start text-left backdrop-blur-sm",
                        activeSection === item.id && [
                          "bg-gradient-to-r from-edu-blue/10 via-edu-blue/20 to-edu-blue/10",
                          "border border-edu-blue/30 shadow-md shadow-edu-blue/10",
                          "text-edu-blue font-medium"
                        ]
                      ]
                    )}
                  >
                    <item.icon className={cn(
                      "transition-all duration-300 group-hover:scale-110 flex-shrink-0",
                      isCollapsed ? [
                        "w-4 h-4 sm:w-5 sm:h-5",
                        activeSection === item.id ? "text-edu-blue drop-shadow-sm" : "text-muted-foreground group-hover:text-foreground"
                      ] : [
                        "w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3",
                        activeSection === item.id ? "text-edu-blue drop-shadow-sm" : "text-muted-foreground group-hover:text-foreground"
                      ]
                    )} />
                    
                    <span className={cn(
                      "transition-all duration-300 flex-1 text-left leading-tight",
                      isCollapsed ? "sr-only" : [
                        "text-xs sm:text-sm font-medium",
                        activeSection === item.id ? "text-edu-blue font-semibold drop-shadow-sm" : "text-foreground/80 group-hover:text-foreground"
                      ]
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Enhanced badge with ultra responsive styling */}
                    {item.badge && (
                      <Badge 
                        variant={item.badge === 'Նոր' ? 'default' : 'secondary'} 
                        className={cn(
                          "text-xs transition-all duration-300 flex-shrink-0 shadow-sm",
                          isCollapsed ? [
                            "absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 p-0 rounded-full flex items-center justify-center",
                            "transform scale-75 backdrop-blur-sm",
                            item.badge === 'Նոր' && "bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg shadow-green-500/30",
                            item.badge !== 'Նոր' && "bg-gradient-to-r from-edu-blue to-edu-blue/80 text-white border-0 shadow-lg shadow-edu-blue/30"
                          ] : [
                            "ml-auto px-1.5 sm:px-2 py-0.5 min-w-fit backdrop-blur-sm",
                            item.badge === 'Նոր' && "bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md shadow-green-500/20",
                            item.badge !== 'Նոր' && "bg-gradient-to-r from-edu-blue to-edu-blue/80 text-white border-0 shadow-md shadow-edu-blue/20"
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

                    {/* Enhanced hover effect with gradient shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out rounded-xl" />
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
