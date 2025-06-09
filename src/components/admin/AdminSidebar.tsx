
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, Users, Settings, FileText, Activity, GraduationCap, Shield, DollarSign, Award, MessageSquare, FolderOpen, Archive, UserPlus, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const AdminSidebar = ({
  activeSection = 'overview',
  onSectionChange
}: AdminSidebarProps) => {
  
  const handleSectionClick = (section: string) => {
    onSectionChange?.(section);
  };
  
  const menuItems = [
    // Գլխավոր ղեկավարում
    {
      id: 'overview',
      label: 'Ընդհանուր վիճակագրություն',
      icon: BarChart3,
      category: 'main',
      badge: null
    },
    {
      id: 'analytics',
      label: 'Վերլուծություն',
      icon: Activity,
      category: 'main',
      badge: 'Նոր'
    },
    {
      id: 'reports',
      label: 'Հաշվետվություններ',
      icon: FileText,
      category: 'main',
      badge: null
    },
    // Ուսումնական բովանդակություն
    {
      id: 'specialties',
      label: 'Մասնագիտություններ',
      icon: GraduationCap,
      category: 'content',
      badge: null
    },
    {
      id: 'assessment',
      label: 'Գնահատում և քննություններ',
      icon: Award,
      category: 'content',
      badge: null
    },
    // Օգտատերերի կառավարում
    {
      id: 'applications',
      label: 'Գրանցման դիմումներ',
      icon: UserPlus,
      category: 'users',
      badge: '3'
    },
    {
      id: 'users',
      label: 'Օգտատերեր',
      icon: Users,
      category: 'users',
      badge: null
    },
    {
      id: 'permissions',
      label: 'Թույլտվություններ',
      icon: Shield,
      category: 'users',
      badge: null
    },
    // Գործառնական
    {
      id: 'finance',
      label: 'Ֆինանսական կառավարում',
      icon: DollarSign,
      category: 'operations',
      badge: null
    },
    {
      id: 'certificates',
      label: 'Վկայականներ',
      icon: Award,
      category: 'operations',
      badge: null
    },
    {
      id: 'communication',
      label: 'Հաղորդակցություն',
      icon: MessageSquare,
      category: 'operations',
      badge: null
    },
    {
      id: 'resources',
      label: 'Ռեսուրսներ',
      icon: FolderOpen,
      category: 'operations',
      badge: null
    },
    // Համակարգային
    {
      id: 'logs',
      label: 'Համակարգային մատյաններ',
      icon: Activity,
      category: 'system',
      badge: null
    },
    {
      id: 'archive',
      label: 'Արխիվ',
      icon: Archive,
      category: 'system',
      badge: null
    },
    {
      id: 'settings',
      label: 'Կարգավորումներ',
      icon: Settings,
      category: 'system',
      badge: null
    }
  ];

  const renderSeparator = (afterCategory: string, beforeCategory: string) => {
    return (
      <div className="py-2">
        <Separator className="bg-border/20 transition-colors duration-200" />
      </div>
    );
  };

  return (
    <Sidebar 
      variant="inset" 
      className="border-r border-border/30 backdrop-blur-sm bg-card/50 transition-all duration-150 ease-out" 
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border/30 p-6 bg-gradient-to-r from-edu-blue/8 to-edu-orange/8 relative overflow-hidden transition-all duration-300">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl shadow-lg group-data-[collapsible=icon]:p-2 transition-all duration-200 hover:scale-105">
            <Shield className="w-6 h-6 text-white group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4 transition-all duration-200" />
            <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse opacity-60"></div>
          </div>
          <div className="flex-1 group-data-[collapsible=icon]:hidden transition-all duration-200">
            <h2 className="font-bold text-xl font-armenian bg-gradient-to-r from-edu-blue to-edu-orange bg-clip-text text-transparent">
              Ադմին վահանակ
            </h2>
            <p className="text-sm text-muted-foreground font-armenian mt-1 flex items-center gap-2">
              Կառավարման համակարգ
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-edu-blue/30 text-edu-blue">
                <Command className="w-3 h-3 mr-1" />
                Ctrl+B
              </Badge>
            </p>
          </div>
        </div>
        
        {/* Enhanced SidebarTrigger positioning */}
        <div className="absolute top-4 right-4">
          <SidebarTrigger className="hover:bg-sidebar-accent/70 transition-all duration-150 hover:scale-110 rounded-lg p-2" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 overflow-y-auto scrollbar-thin">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item, index) => {
                const nextItem = menuItems[index + 1];
                const shouldShowSeparator = nextItem && item.category !== nextItem.category;
                
                return (
                  <React.Fragment key={item.id}>
                    <SidebarMenuItem 
                      className="group/menu-item"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'slideInLeft 0.3s ease-out forwards'
                      }}
                    >
                      <SidebarMenuButton 
                        onClick={() => handleSectionClick(item.id)} 
                        isActive={activeSection === item.id}
                        tooltip={item.label}
                        className={cn(
                          "font-armenian h-12 px-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                          "hover:bg-gradient-to-r hover:from-sidebar-accent/70 hover:to-sidebar-accent/50 hover:shadow-sm hover:scale-[1.02]",
                          "focus-visible:ring-2 focus-visible:ring-edu-blue/50 focus-visible:outline-none",
                          activeSection === item.id && [
                            "bg-gradient-to-r from-edu-blue/15 to-edu-orange/10",
                            "border-l-4 border-edu-blue shadow-sm",
                            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-edu-blue/5 before:to-transparent before:opacity-50"
                          ]
                        )}
                      >
                        <item.icon className={cn(
                          "w-5 h-5 transition-all duration-200 group-hover:scale-110",
                          activeSection === item.id ? "text-edu-blue" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        <span className={cn(
                          "transition-all duration-200 group-data-[collapsible=icon]:sr-only flex-1",
                          activeSection === item.id ? "text-edu-blue font-medium" : "text-foreground/80 group-hover:text-foreground"
                        )}>
                          {item.label}
                        </span>
                        
                        {/* Badge for notifications */}
                        {item.badge && (
                          <Badge 
                            variant={item.badge === 'Նոր' ? 'default' : 'secondary'}
                            className={cn(
                              "ml-auto text-xs px-2 py-0.5 transition-all duration-200",
                              "group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:top-1 group-data-[collapsible=icon]:right-1",
                              "group-data-[collapsible=icon]:w-2 group-data-[collapsible=icon]:h-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:rounded-full",
                              item.badge === 'Նոր' && "bg-gradient-to-r from-green-500 to-green-600 text-white border-0",
                              item.badge !== 'Նոր' && "bg-gradient-to-r from-edu-blue to-edu-purple text-white border-0"
                            )}
                          >
                            <span className="group-data-[collapsible=icon]:sr-only">
                              {item.badge}
                            </span>
                          </Badge>
                        )}

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {shouldShowSeparator && renderSeparator(item.category, nextItem.category)}
                  </React.Fragment>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/30 p-4 bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm">
        <div className="text-xs text-muted-foreground font-armenian text-center py-2 group-data-[collapsible=icon]:hidden transition-all duration-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gradient-to-r from-edu-blue to-edu-orange rounded-full animate-pulse"></div>
            <span>Վարկան 2024 - Ուսումնական հարթակ</span>
          </div>
          <div className="text-xs opacity-70">
            Վերջին թարմացում: {new Date().toLocaleDateString('hy-AM')}
          </div>
        </div>
        <div className="group-data-[collapsible=icon]:block hidden">
          <div className="w-2 h-2 bg-gradient-to-r from-edu-blue to-edu-orange rounded-full animate-pulse mx-auto"></div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
