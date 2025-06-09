
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
      <SidebarHeader className="border-b border-border/20 p-6 bg-card/80 backdrop-blur-md relative overflow-hidden">
        {/* Clean geometric pattern background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, hsl(var(--edu-blue)) 0.5px, transparent 0.5px),
              linear-gradient(-45deg, hsl(var(--edu-orange)) 0.5px, transparent 0.5px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl shadow-sm group-data-[collapsible=icon]:p-2 transition-all duration-200 hover:shadow-md">
              <Shield className="w-6 h-6 text-white group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4 transition-all duration-200" />
            </div>
          </div>
          
          <div className="flex-1 group-data-[collapsible=icon]:hidden transition-all duration-200">
            <h2 className="font-bold text-xl font-armenian text-foreground">
              Ադմին վահանակ
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground font-armenian">
                Կառավարման համակարգ
              </p>
              <Badge variant="outline" className="text-xs px-2 py-0.5 border-edu-blue/30 text-edu-blue bg-edu-blue/5">
                <Command className="w-3 h-3 mr-1" />
                Ctrl+B
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Enhanced SidebarTrigger positioning */}
        <div className="absolute top-4 right-4">
          <SidebarTrigger className="hover:bg-sidebar-accent/70 transition-all duration-150 hover:scale-105 rounded-lg p-2 border border-border/20" />
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
                        animationDelay: `${index * 40}ms`,
                        animation: 'slideInLeft 0.3s ease-out forwards'
                      }}
                    >
                      <SidebarMenuButton 
                        onClick={() => handleSectionClick(item.id)} 
                        isActive={activeSection === item.id}
                        tooltip={item.label}
                        className={cn(
                          "font-armenian h-12 px-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                          "hover:bg-sidebar-accent/80 hover:shadow-sm hover:scale-[1.01]",
                          "focus-visible:ring-2 focus-visible:ring-edu-blue/50 focus-visible:outline-none",
                          activeSection === item.id && [
                            "bg-edu-blue/10 border border-edu-blue/20 shadow-sm",
                            "text-edu-blue font-medium"
                          ]
                        )}
                      >
                        <item.icon className={cn(
                          "w-5 h-5 transition-all duration-200 group-hover:scale-105",
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
                              item.badge === 'Նոր' && "bg-green-500 text-white border-0",
                              item.badge !== 'Նոր' && "bg-edu-blue text-white border-0"
                            )}
                          >
                            <span className="group-data-[collapsible=icon]:sr-only">
                              {item.badge}
                            </span>
                          </Badge>
                        )}

                        {/* Subtle hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
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

      <SidebarFooter className="border-t border-border/20 p-4 bg-muted/30 backdrop-blur-sm">
        <div className="text-xs text-muted-foreground font-armenian text-center py-2 group-data-[collapsible=icon]:hidden transition-all duration-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-edu-blue rounded-full opacity-60"></div>
            <span>Վարկան 2024 - Ուսումնական հարթակ</span>
          </div>
          <div className="text-xs opacity-60">
            Վերջին թարմացում: {new Date().toLocaleDateString('hy-AM')}
          </div>
        </div>
        <div className="group-data-[collapsible=icon]:block hidden">
          <div className="w-2 h-2 bg-edu-blue rounded-full opacity-60 mx-auto"></div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
