
import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, Users, Settings, FileText, Activity, GraduationCap, Shield, DollarSign, Award, MessageSquare, FolderOpen, Archive, ChevronRight, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const AdminSidebar = ({
  activeSection = 'overview',
  onSectionChange
}: AdminSidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['main', 'content', 'users']);
  
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]);
  };
  
  const handleSectionClick = (section: string) => {
    onSectionChange?.(section);
  };
  
  const menuGroups = [{
    id: 'main',
    label: 'Գլխավոր ղեկավարում',
    items: [{
      id: 'overview',
      label: 'Ընդհանուր վիճակագրություն',
      icon: BarChart3
    }, {
      id: 'analytics',
      label: 'Վերլուծություն',
      icon: Activity
    }, {
      id: 'reports',
      label: 'Հաշվետվություններ',
      icon: FileText
    }]
  }, {
    id: 'content',
    label: 'Ուսումնական բովանդակություն',
    items: [{
      id: 'specialties',
      label: 'Մասնագիտություններ',
      icon: GraduationCap
    }, {
      id: 'assessment',
      label: 'Գնահատում և քննություններ',
      icon: Award
    }]
  }, {
    id: 'users',
    label: 'Օգտատերերի կառավարում',
    items: [{
      id: 'applications',
      label: 'Գրանցման դիմումներ',
      icon: UserPlus
    }, {
      id: 'users',
      label: 'Օգտատերեր',
      icon: Users
    }, {
      id: 'permissions',
      label: 'Թույլտվություններ',
      icon: Shield
    }]
  }, {
    id: 'operations',
    label: 'Գործառնական',
    items: [{
      id: 'finance',
      label: 'Ֆինանսական կառավարում',
      icon: DollarSign
    }, {
      id: 'certificates',
      label: 'Վկայականներ',
      icon: Award
    }, {
      id: 'communication',
      label: 'Հաղորդակցություն',
      icon: MessageSquare
    }, {
      id: 'resources',
      label: 'Ռեսուրսներ',
      icon: FolderOpen
    }]
  }, {
    id: 'system',
    label: 'Համակարգային',
    items: [{
      id: 'logs',
      label: 'Համակարգային մատյաններ',
      icon: Activity
    }, {
      id: 'archive',
      label: 'Արխիվ',
      icon: Archive
    }, {
      id: 'settings',
      label: 'Կարգավորումներ',
      icon: Settings
    }]
  }];

  return (
    <Sidebar variant="inset" className="border-r border-border/50 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border/50 p-6 bg-gradient-to-r from-edu-blue/5 to-edu-orange/5">
        <div className="flex items-center gap-4">
          <div className="relative p-3 bg-gradient-to-br from-edu-blue to-edu-orange rounded-xl shadow-lg">
            <Shield className="w-6 h-6 text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse-subtle"></div>
          </div>
          <div className="flex-1">
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

      <SidebarContent className="px-3 py-2">
        {menuGroups.map(group => (
          <SidebarGroup key={group.id} className="mb-2">
            <SidebarGroupLabel 
              className="flex items-center justify-between cursor-pointer py-3 px-3 font-armenian hover:bg-sidebar-accent/50 rounded-lg transition-all duration-200 group mb-2" 
              onClick={() => toggleGroup(group.id)}
            >
              <span className="text-sm font-semibold text-foreground/70 group-hover:text-foreground transition-colors">
                {group.label}
              </span>
              <ChevronRight className={cn(
                "w-4 h-4 transition-all duration-200 text-muted-foreground group-hover:text-foreground", 
                expandedGroups.includes(group.id) && "rotate-90"
              )} />
            </SidebarGroupLabel>
            
            {expandedGroups.includes(group.id) && (
              <SidebarGroupContent className="space-y-1">
                <SidebarMenu>
                  {group.items.map(item => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        onClick={() => handleSectionClick(item.id)} 
                        isActive={activeSection === item.id} 
                        className={cn(
                          "font-armenian h-11 px-3 rounded-lg transition-all duration-200 group",
                          "hover:bg-sidebar-accent/70 hover:shadow-sm",
                          activeSection === item.id && "bg-gradient-to-r from-edu-blue/10 to-edu-orange/10 border-l-4 border-edu-blue shadow-sm"
                        )}
                      >
                        <item.icon className={cn(
                          "w-5 h-5 transition-colors",
                          activeSection === item.id ? "text-edu-blue" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                        <span className={cn(
                          "transition-colors",
                          activeSection === item.id ? "text-edu-blue font-medium" : "text-foreground/80 group-hover:text-foreground"
                        )}>
                          {item.label}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4 bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="text-xs text-muted-foreground font-armenian text-center py-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-edu-blue to-edu-orange rounded-full animate-pulse"></div>
            <span>Վարկան 2024 - Ուսումնական հարթակ</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
