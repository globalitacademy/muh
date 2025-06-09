import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, Users, Settings, FileText, Activity, GraduationCap, Shield, DollarSign, Award, MessageSquare, FolderOpen, Archive, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const AdminSidebar = ({
  activeSection = 'overview',
  onSectionChange
}: AdminSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

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
    }, {
      id: 'analytics',
      label: 'Վերլուծություն',
      icon: Activity,
      category: 'main',
      badge: 'Նոր'
    }, {
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
    }, {
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
    }, {
      id: 'users',
      label: 'Օգտատերեր',
      icon: Users,
      category: 'users',
      badge: null
    }, {
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
    }, {
      id: 'certificates',
      label: 'Վկայականներ',
      icon: Award,
      category: 'operations',
      badge: null
    }, {
      id: 'communication',
      label: 'Հաղորդակցություն',
      icon: MessageSquare,
      category: 'operations',
      badge: null
    }, {
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
    }, {
      id: 'archive',
      label: 'Արխիվ',
      icon: Archive,
      category: 'system',
      badge: null
    }, {
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
    <>
      <Sidebar variant="inset" className="border-r border-border/30 backdrop-blur-sm bg-card/50 transition-all duration-150 ease-out" collapsible="icon">
        <SidebarHeader className="border-b border-border/20 p-6 bg-card/80 backdrop-blur-md relative overflow-hidden">
          {/* Clean minimal background */}
          <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-accent/5" />
          
          {/* Main header content container - removed toggle button */}
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

        <SidebarContent className={cn(
          "px-3 py-4 overflow-y-auto scrollbar-thin",
          isCollapsed && "flex flex-col items-center"
        )}>
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
                          tooltip={item.label} 
                          className={cn(
                            "font-armenian h-12 rounded-xl transition-all duration-200 group relative overflow-hidden",
                            "hover:bg-sidebar-accent/80 hover:shadow-sm hover:scale-[1.01]",
                            "focus-visible:ring-2 focus-visible:ring-edu-blue/50 focus-visible:outline-none",
                            // Microsoft-style collapsed state - center icons
                            isCollapsed ? [
                              "px-0 justify-center w-12 mx-auto",
                              activeSection === item.id && "bg-edu-blue/10 border border-edu-blue/20 shadow-sm"
                            ] : [
                              "px-3",
                              activeSection === item.id && ["bg-edu-blue/10 border border-edu-blue/20 shadow-sm", "text-edu-blue font-medium"]
                            ]
                          )}
                        >
                          <item.icon className={cn(
                            "transition-all duration-200 group-hover:scale-105",
                            isCollapsed ? [
                              "w-5 h-5",
                              activeSection === item.id ? "text-edu-blue" : "text-muted-foreground group-hover:text-foreground"
                            ] : [
                              "w-5 h-5",
                              activeSection === item.id ? "text-edu-blue" : "text-muted-foreground group-hover:text-foreground"
                            ]
                          )} />
                          
                          <span className={cn(
                            "transition-all duration-200 flex-1",
                            isCollapsed ? "sr-only" : [
                              activeSection === item.id ? "text-edu-blue font-medium" : "text-foreground/80 group-hover:text-foreground"
                            ]
                          )}>
                            {item.label}
                          </span>
                          
                          {/* Microsoft-style badge positioning */}
                          {item.badge && (
                            <Badge 
                              variant={item.badge === 'Նոր' ? 'default' : 'secondary'} 
                              className={cn(
                                "text-xs transition-all duration-200",
                                isCollapsed ? [
                                  "absolute -top-1 -right-1 w-5 h-5 p-0 rounded-full flex items-center justify-center",
                                  "transform scale-75",
                                  item.badge === 'Նոր' && "bg-green-500 text-white border-0",
                                  item.badge !== 'Նոր' && "bg-edu-blue text-white border-0"
                                ] : [
                                  "ml-auto px-2 py-0.5",
                                  item.badge === 'Նոր' && "bg-green-500 text-white border-0",
                                  item.badge !== 'Նոր' && "bg-edu-blue text-white border-0"
                                ]
                              )}
                            >
                              <span className={cn(isCollapsed && item.badge !== 'Նոր' ? "text-xs" : "")}>
                                {isCollapsed && item.badge !== 'Նոր' ? item.badge.slice(0, 1) : item.badge}
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
          <div className={cn(
            "text-xs text-muted-foreground font-armenian text-center py-2 transition-all duration-200",
            isCollapsed && "hidden"
          )}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-edu-blue rounded-full opacity-60"></div>
              <span>Վարկան 2024 - Ուսումնական հարթակ</span>
            </div>
            <div className="text-xs opacity-60">
              Վերջին թարմացում: {new Date().toLocaleDateString('hy-AM')}
            </div>
          </div>
          <div className={cn("hidden", isCollapsed && "block flex justify-center")}>
            <div className="w-2 h-2 bg-edu-blue rounded-full opacity-60"></div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Floating Toggle Button - appears in bottom-right */}
      <FloatingToggleButton isCollapsed={isCollapsed} />
    </>
  );
};

// New floating toggle button component
const FloatingToggleButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn(
        "fixed z-50 transition-all duration-300 rounded-xl shadow-lg border-2",
        // Position based on collapsed state
        isCollapsed ? [
          "bottom-6 right-6 h-14 w-14",
          "bg-edu-blue/90 backdrop-blur-md border-edu-blue/30",
          "hover:bg-edu-blue hover:shadow-xl hover:scale-110",
          "text-white"
        ] : [
          "bottom-4 right-4 h-10 w-10",
          "bg-background/95 backdrop-blur-sm border-border/40",
          "hover:bg-sidebar-accent hover:border-edu-blue/30 hover:shadow-md hover:scale-105"
        ],
        // Focus and active states
        "focus-visible:ring-2 focus-visible:ring-edu-blue focus-visible:ring-offset-2 focus-visible:outline-none",
        "active:scale-95"
      )}
    >
      {isCollapsed ? (
        <ChevronRight className={cn(
          "transition-transform duration-200",
          isCollapsed ? "h-6 w-6 text-white" : "h-4 w-4 text-foreground/80"
        )} />
      ) : (
        <ChevronLeft className={cn(
          "transition-transform duration-200",
          isCollapsed ? "h-6 w-6 text-white" : "h-4 w-4 text-foreground/80"
        )} />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default AdminSidebar;
