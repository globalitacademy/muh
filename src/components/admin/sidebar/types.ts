
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  category: string;
  badge: string | null;
}

export interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}
