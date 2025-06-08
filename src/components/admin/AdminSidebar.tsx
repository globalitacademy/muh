
import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';
import { BarChart3, BookOpen, Users, Settings, FileText, Activity, GraduationCap, Shield, DollarSign, Award, MessageSquare, FolderOpen, Archive, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const AdminSidebar = ({
  activeSection = 'overview',
  onSectionChange
}: AdminSidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['main', 'content']);
  
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
      id: 'modules',
      label: 'Մոդուլներ',
      icon: BookOpen
    }, {
      id: 'curriculum',
      label: 'Ուսումնական ծրագրեր',
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
      id: 'users',
      label: 'Օգտատերերի կառավարում',
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
    <Sidebar variant="inset" className="border-r border-border">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-edu-blue to-edu-orange rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg font-armenian">Ադմին վահանակ</h2>
            <p className="text-sm text-muted-foreground font-armenian">Կառավարման համակարգ</p>
          </div>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>

      <SidebarContent className="px-2">
        {menuGroups.map(group => (
          <SidebarGroup key={group.id}>
            <SidebarGroupLabel 
              className="flex items-center justify-between cursor-pointer py-2 px-2 font-armenian hover:bg-sidebar-accent rounded-md" 
              onClick={() => toggleGroup(group.id)}
            >
              <span className="text-left">{group.label}</span>
              <ChevronRight className={cn("w-4 h-4 transition-transform", expandedGroups.includes(group.id) && "rotate-90")} />
            </SidebarGroupLabel>
            
            {expandedGroups.includes(group.id) && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(item => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton 
                        onClick={() => handleSectionClick(item.id)} 
                        isActive={activeSection === item.id} 
                        className="font-armenian"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="text-xs text-muted-foreground font-armenian text-center">
          Վարկան 2024 - Ուսումնական հարթակ
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
