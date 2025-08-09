
import { BarChart3, Users, Settings, FileText, Activity, GraduationCap, Shield, DollarSign, Award, MessageSquare, Archive, UserPlus, Key, FolderOpen } from 'lucide-react';
import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
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
    id: 'projects', 
    label: 'Նախագծեր',
    icon: FolderOpen,
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
    badge: null
  }, {
    id: 'users',
    label: 'Օգտատերեր',
    icon: Users,
    category: 'users',
    badge: null
  }, {
    id: 'access-codes',
    label: 'Հասանելիության կոդեր',
    icon: Key,
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
