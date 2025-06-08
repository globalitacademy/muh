
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, Users, Settings, FileText, Activity, GraduationCap, Shield, DollarSign, Award, MessageSquare, FolderOpen, Archive, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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
      category: 'main'
    },
    {
      id: 'analytics',
      label: 'Վերլուծություն',
      icon: Activity,
      category: 'main'
    },
    {
      id: 'reports',
      label: 'Հաշվետվություններ',
      icon: FileText,
      category: 'main'
    },
    // Ուսումնական բովանդակություն
    {
      id: 'specialties',
      label: 'Մասնագիտություններ',
      icon: GraduationCap,
      category: 'content'
    },
    {
      id: 'assessment',
      label: 'Գնահատում և քննություններ',
      icon: Award,
      category: 'content'
    },
    // Օգտատերերի կառավարում
    {
      id: 'applications',
      label: 'Գրանցման դիմումներ',
      icon: UserPlus,
      category: 'users'
    },
    {
      id: 'users',
      label: 'Օգտատերեր',
      icon: Users,
      category: 'users'
    },
    {
      id: 'permissions',
      label: 'Թույլտվություններ',
      icon: Shield,
      category: 'users'
    },
    // Գործառնական
    {
      id: 'finance',
      label: 'Ֆինանսական կառավարում',
      icon: DollarSign,
      category: 'operations'
    },
    {
      id: 'certificates',
      label: 'Վկայականներ',
      icon: Award,
      category: 'operations'
    },
    {
      id: 'communication',
      label: 'Հաղորդակցություն',
      icon: MessageSquare,
      category: 'operations'
    },
    {
      id: 'resources',
      label: 'Ռեսուրսներ',
      icon: FolderOpen,
      category: 'operations'
    },
    // Համակարգային
    {
      id: 'logs',
      label: 'Համակարգային մատյաններ',
      icon: Activity,
      category: 'system'
    },
    {
      id: 'archive',
      label: 'Արխիվ',
      icon: Archive,
      category: 'system'
    },
    {
      id: 'settings',
      label: 'Կարգավորումներ',
      icon: Settings,
      category: 'system'
    }
  ];

  const renderSeparator = (afterCategory: string, beforeCategory: string) => {
    return (
      <div className="py-2">
        <Separator className="bg-border/30" />
      </div>
    );
  };

  return (
    <Sidebar variant="inset" className="border-r border-border/50 backdrop-blur-sm" collapsible="icon">
      <SidebarHeader className="border-b border-border/50 p-6 bg-gradient-to-r from-edu-blue/5 to-edu-orange/5">
        <div className="flex items-center gap-4">
          <div className="relative p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl shadow-lg group-data-[collapsible=icon]:p-2">
            <Shield className="w-6 h-6 text-white group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4" />
            <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse-subtle"></div>
          </div>
          <div className="flex-1 group-data-[collapsible=icon]:hidden">
            <h2 className="font-bold text-xl font-armenian bg-gradient-to-r from-edu-blue to-edu-orange bg-clip-text text-transparent">
              Ադմին վահանակ
            </h2>
            <p className="text-sm text-muted-foreground font-armenian mt-1">
              Կառավարման համակարգ
            </p>
          </div>
        </div>
        <SidebarTrigger className="ml-auto hover:bg-sidebar-accent/50 transition-colors" />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item, index) => {
                const nextItem = menuItems[index + 1];
                const shouldShowSeparator = nextItem && item.category !== nextItem.category;
                
                return (
                  <React.Fragment key={item.id}>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => handleSectionClick(item.id)} 
                        isActive={activeSection === item.id}
                        tooltip={item.label}
                        className={cn(
                          "font-armenian h-12 px-3 rounded-lg transition-all duration-200 group",
                          "hover:bg-sidebar-accent/70 hover:shadow-sm",
                          activeSection === item.id && "bg-gradient-to-r from-edu-blue/10 to-edu-orange/10 border-l-4 border-edu-blue shadow-sm"
                        )}
                      >
                        <item.icon className={cn(
                          "w-5 h-5 transition-colors",
                          activeSection === item.id ? "text-edu-blue" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        <span className={cn(
                          "transition-colors group-data-[collapsible=icon]:sr-only",
                          activeSection === item.id ? "text-edu-blue font-medium" : "text-foreground/80 group-hover:text-foreground"
                        )}>
                          {item.label}
                        </span>
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

      <SidebarFooter className="border-t border-border/50 p-4 bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="text-xs text-muted-foreground font-armenian text-center py-2 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-edu-blue to-edu-orange rounded-full animate-pulse"></div>
            <span>Վարկան 2024 - Ուսումնական հարթակ</span>
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
